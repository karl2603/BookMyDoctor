
package com.karl.BookMyDoc.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle errors that already have an HTTP status.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(
            ResponseStatusException exception,
            HttpServletRequest request) {

        HttpStatusCode status = exception.getStatusCode();
        HttpStatus resolvedStatus = HttpStatus.resolve(status.value());

        String error = resolvedStatus != null
                ? resolvedStatus.getReasonPhrase()
                : "Request Error";

        String message = exception.getReason() != null
                ? exception.getReason()
                : error;

        return buildResponse(
                status,
                error,
                message,
                request.getRequestURI(),
                Map.of()
        );
    }

    // Handle @Valid request-body validation errors.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {

        Map<String, String> validationErrors = new LinkedHashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(fieldError ->
                validationErrors.put(
                        fieldError.getField(),
                        fieldError.getDefaultMessage() != null
                                ? fieldError.getDefaultMessage()
                                : "Invalid value"
                )
        );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Bad Request",
                "Validation failed",
                request.getRequestURI(),
                validationErrors
        );
    }

    // Handle malformed JSON or invalid request-body formats.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableMessage(
            HttpMessageNotReadableException exception,
            HttpServletRequest request) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Bad Request",
                "Invalid or malformed request body",
                request.getRequestURI(),
                Map.of()
        );
    }

    // Handle database constraint conflicts.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(
            DataIntegrityViolationException exception,
            HttpServletRequest request) {

        return buildResponse(
                HttpStatus.CONFLICT,
                "Conflict",
                "The request conflicts with existing data",
                request.getRequestURI(),
                Map.of()
        );
    }

    // Catch unexpected server errors without exposing internal details.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpectedException(
            Exception exception,
            HttpServletRequest request) {

        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal Server Error",
                "An unexpected error occurred",
                request.getRequestURI(),
                Map.of()
        );
    }

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatusCode status,
            String error,
            String message,
            String path,
            Map<String, String> validationErrors) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        body.put("path", path);
        body.put("validationErrors", validationErrors);

        return ResponseEntity.status(status).body(body);
    }
}

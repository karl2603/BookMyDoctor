package com.karl.BookMyDoc.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir =
            Paths.get("D:/Desktop/BookMyDoc/FileSystem/ProfilePictures");

    public String saveProfilePicture(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        Files.createDirectories(uploadDir);

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(
                    originalFilename.lastIndexOf(".")
            );
        }

        String filename = UUID.randomUUID() + extension;

        Path filePath = uploadDir.resolve(filename);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/profile/" + filename;
    }
}
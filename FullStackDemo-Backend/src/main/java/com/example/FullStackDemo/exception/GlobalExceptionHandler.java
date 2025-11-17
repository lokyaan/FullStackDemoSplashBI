package com.example.FullStackDemo.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import io.jsonwebtoken.JwtException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.*;
import org.springframework.web.bind.annotation.*;

import org.springframework.validation.BindException;                      
import org.springframework.web.bind.MissingServletRequestParameterException;

import java.time.Instant;
import java.util.*;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // ====== 400s ======

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .findFirst().orElse("Validation failed");
        log.error("400 Validation failed: {}", msg);
        return problem(HttpStatus.BAD_REQUEST, msg);
    }

    @ExceptionHandler({BindException.class, MissingServletRequestParameterException.class})
    public ResponseEntity<?> handleBind(Exception ex) {
        log.error("400 Bind error: {}", ex.getMessage());
        return problem(HttpStatus.BAD_REQUEST, "Invalid parameters");
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleConstraint(ConstraintViolationException ex) {
        String msg = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .findFirst().orElse("Constraint violation");
        log.error("400 Constraint violation: {}", msg);
        return problem(HttpStatus.BAD_REQUEST, msg);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleNotReadable(org.springframework.http.converter.HttpMessageNotReadableException ex) {
        String root = (ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage());
        log.error("400 Malformed JSON: {}", root);
        return problem(HttpStatus.BAD_REQUEST, "Malformed JSON: " + root);
    }

    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<?> handleInvalidFormat(InvalidFormatException ex) {
        log.error("400 Invalid format: {}", ex.getMessage());
        return problem(HttpStatus.BAD_REQUEST, "Invalid value for field");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArg(IllegalArgumentException ex) {
        log.error("400 Illegal argument: {}", ex.getMessage());
        return problem(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrity(org.springframework.dao.DataIntegrityViolationException ex) {
        log.error("400 Data integrity violation: {}", ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage());
        return problem(HttpStatus.BAD_REQUEST, "Data integrity violation (possibly duplicate or FK constraint).");
    }

    // ====== 401/403 (security) ======

    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class, JwtException.class})
    public ResponseEntity<?> handleAuth(Exception ex) {
        log.error("401 Auth error: {}", ex.getMessage());
        return problem(HttpStatus.UNAUTHORIZED, "Authentication failed");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
        log.error("403 Forbidden: {}", ex.getMessage());
        return problem(HttpStatus.FORBIDDEN, "Forbidden");
    }

    // ====== 405 ======
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        log.error("405 Method not supported: {}", ex.getMethod());
        return problem(HttpStatus.METHOD_NOT_ALLOWED, "Method not allowed");
    }

    // ====== 409 ======
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleIllegalState(IllegalStateException ex) {
        log.error("409 Conflict: {}", ex.getMessage());
        return problem(HttpStatus.CONFLICT, ex.getMessage());
    }

    // ====== 500 fallback ======
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAny(Exception ex) {
        // Log with stack trace to error log
        log.error("500 Unhandled error", ex);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error");
    }

    // ====== helper ======
    private ResponseEntity<Map<String,Object>> problem(HttpStatus status, String message) {
        Map<String,Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}

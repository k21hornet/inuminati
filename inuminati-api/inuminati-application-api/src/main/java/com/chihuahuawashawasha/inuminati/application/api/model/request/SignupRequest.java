package com.chihuahuawashawasha.inuminati.application.api.model.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class SignupRequest {

    @Email
    String email;
}

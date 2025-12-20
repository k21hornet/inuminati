package com.chihuahuawashawasha.inuminati.model.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class SignupRequest {

    @Email
    String email;
}

/**
 * File: SignUpActivity.kt
 * Purpose: Handles user registration with email and password. Validates user input,
 *          creates new user accounts in Firebase, and navigates to dashboard upon success.
 * Author: Usman Azfar
 */
package com.yourname.helmx

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.yourname.helmx.AuthManager
import com.yourname.helmx.databinding.ActivitySignupBinding
import kotlinx.coroutines.launch

class SignUpActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySignupBinding
    private val authManager = AuthManager()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignupBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupClickListeners()
    }

    private fun setupClickListeners() {
        binding.btnSignUp.setOnClickListener {
            val fullName = binding.etFullName.text.toString().trim()
            val email = binding.etEmail.text.toString().trim()
            val phone = binding.etPhone.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            val confirmPassword = binding.etConfirmPassword.text.toString().trim()
            val termsAccepted = binding.cbTerms.isChecked

            if (validateSignUpInputs(fullName, email, phone, password, confirmPassword, termsAccepted)) {
                performSignUp(fullName, email, phone, password)
            }
        }

        binding.tvLogin.setOnClickListener {
            finish()
        }

        binding.btnGoogleSignUp.setOnClickListener {
            Toast.makeText(this, "Google Sign-Up coming soon!", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Validates all sign-up input fields including format checks and password matching.
     * Returns true only if all validations pass.
     */
    private fun validateSignUpInputs(
        fullName: String,
        email: String,
        phone: String,
        password: String,
        confirmPassword: String,
        termsAccepted: Boolean
    ): Boolean {
        if (fullName.isEmpty()) {
            binding.tilFullName.error = "Full name is required"
            return false
        }
        binding.tilFullName.error = null

        if (email.isEmpty()) {
            binding.tilEmail.error = "Email is required"
            return false
        }
        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilEmail.error = "Invalid email format"
            return false
        }
        binding.tilEmail.error = null

        if (phone.isEmpty()) {
            binding.tilPhone.error = "Phone number is required"
            return false
        }
        if (phone.length < 10) {
            binding.tilPhone.error = "Invalid phone number"
            return false
        }
        binding.tilPhone.error = null

        if (password.isEmpty()) {
            binding.tilPassword.error = "Password is required"
            return false
        }
        if (password.length < 6) {
            binding.tilPassword.error = "Password must be at least 6 characters"
            return false
        }
        binding.tilPassword.error = null

        if (confirmPassword.isEmpty()) {
            binding.tilConfirmPassword.error = "Please confirm your password"
            return false
        }
        if (password != confirmPassword) {
            binding.tilConfirmPassword.error = "Passwords do not match"
            return false
        }
        binding.tilConfirmPassword.error = null

        if (!termsAccepted) {
            Toast.makeText(this, "Please accept Terms & Conditions", Toast.LENGTH_SHORT).show()
            return false
        }

        return true
    }

    /**
     * Performs asynchronous user registration with comprehensive error handling.
     * Uses pattern matching to provide user-friendly error messages for different failure scenarios.
     */
    private fun performSignUp(fullName: String, email: String, phone: String, password: String) {
        binding.btnSignUp.isEnabled = false
        binding.btnSignUp.text = "Creating account..."

        lifecycleScope.launch {
            val result = authManager.signUpWithEmail(email, password, fullName, phone)

            result.fold(
                onSuccess = { uid ->
                    Toast.makeText(
                        this@SignUpActivity,
                        "Account created successfully!",
                        Toast.LENGTH_SHORT
                    ).show()

                    val intent = Intent(this@SignUpActivity, DashboardActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                },
                onFailure = { exception ->
                    val errorMessage = when {
                        exception.message?.contains("already in use") == true ->
                            "This email is already registered"
                        exception.message?.contains("invalid-email") == true ->
                            "Invalid email address"
                        exception.message?.contains("weak-password") == true ->
                            "Password is too weak"
                        exception.message?.contains("network") == true ->
                            "Network error. Check your connection"
                        else ->
                            "Sign up failed: ${exception.message}"
                    }

                    Toast.makeText(
                        this@SignUpActivity,
                        errorMessage,
                        Toast.LENGTH_LONG
                    ).show()

                    binding.btnSignUp.isEnabled = true
                    binding.btnSignUp.text = "Sign Up"
                }
            )
        }
    }
}
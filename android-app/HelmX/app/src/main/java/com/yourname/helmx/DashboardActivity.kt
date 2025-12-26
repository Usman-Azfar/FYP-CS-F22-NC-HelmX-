package com.yourname.helmx

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.yourname.helmx.AuthManager
import com.yourname.helmx.databinding.ActivityDashboardTempBinding
import kotlinx.coroutines.launch

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardTempBinding
    private val authManager = AuthManager()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardTempBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Check if user is logged in
        val currentUser = authManager.getCurrentUser()
        if (currentUser == null) {
            navigateToLogin()
            return
        }

        // Load user data
        loadUserData(currentUser.uid)

        // Setup button click listeners
        setupClickListeners()
    }

    private fun setupClickListeners() {
        // Navigate to Navigation page
        binding.btnNavigation.setOnClickListener {
            val intent = Intent(this, NavigationActivity::class.java)
            startActivity(intent)
        }

        // Navigate to Settings page
//        binding.btnSettings.setOnClickListener {
//            val intent = Intent(this, SettingsActivity::class.java)
//            startActivity(intent)
//        }

        // Logout button
        binding.btnLogout.setOnClickListener {
            logout()
        }
    }

    private fun loadUserData(uid: String) {
        binding.tvStatus.text = "Loading user data..."

        lifecycleScope.launch {
            val result = authManager.getUserData(uid)

            result.fold(
                onSuccess = { user ->
                    // Display user information
                    binding.tvWelcome.text = "Welcome, ${user.fullname}!"
                    binding.tvEmail.text = "Email: ${user.email}"
                    binding.tvPhone.text = "Phone: ${user.phone}"
                    binding.tvUid.text = "User ID: ${user.id}"
                    binding.tvStatus.text = "✅ Login Successful!"

                    Toast.makeText(
                        this@DashboardActivity,
                        "Data loaded successfully!",
                        Toast.LENGTH_SHORT
                    ).show()
                },
                onFailure = { exception ->
                    binding.tvStatus.text = "⚠️ Error loading data"
                    binding.tvWelcome.text = "Welcome!"
                    binding.tvEmail.text = "Email: ${authManager.getCurrentUser()?.email}"
                    binding.tvPhone.text = "Phone: Not available"
                    binding.tvUid.text = "UID: ${uid}"

                    Toast.makeText(
                        this@DashboardActivity,
                        "Error: ${exception.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            )
        }
    }

    private fun logout() {
        authManager.signOut()
        Toast.makeText(this, "Logged out successfully", Toast.LENGTH_SHORT).show()
        navigateToLogin()
    }

    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}
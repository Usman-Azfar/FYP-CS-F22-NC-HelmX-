/**
 * File: User.kt
 * Purpose: Data class representing a user entity in the application.
 *          Used for Firestore database operations and user data management.
 * Author: Usman Azfar
 */
package com.yourname.helmx

data class User(
    val id: String = "",
    val fullname: String = "",
    val email: String = "",
    val password: String = "",
    val phone: String = "",
    val createdAt: Long = 0L
)
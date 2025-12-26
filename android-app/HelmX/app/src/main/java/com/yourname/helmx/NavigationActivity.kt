package com.yourname.helmx

import android.Manifest
import android.content.pm.PackageManager
import android.location.Address
import android.location.Geocoder
import android.os.Bundle
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.yourname.helmx.databinding.ActivityNavigationBinding
import java.util.Locale

class NavigationActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var binding: ActivityNavigationBinding
    private lateinit var googleMap: GoogleMap
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var geocoder: Geocoder

    // Default location (Lahore, Pakistan)
    private val defaultLocation = LatLng(31.5204, 74.3587)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityNavigationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize location client
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        geocoder = Geocoder(this, Locale.getDefault())

        // Initialize map
        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.mapFragment) as SupportMapFragment
        mapFragment.getMapAsync(this)

        setupClickListeners()
    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map

        // Configure map settings
        googleMap.uiSettings.apply {
            isZoomControlsEnabled = true
            isCompassEnabled = true
            isMyLocationButtonEnabled = false // We'll use our custom button
        }

        // Check location permission and enable
        checkLocationPermission()

        // Move camera to default location
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(defaultLocation, 12f))
    }

    private fun setupClickListeners() {
        // Back button
        binding.btnBack.setOnClickListener {
            finish()
        }

        // Search button
        binding.btnSearch.setOnClickListener {
            performSearch()
        }

        // Search on keyboard "Search" button
        binding.etSearch.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                performSearch()
                true
            } else {
                false
            }
        }

        // My Location FAB
        binding.fabMyLocation.setOnClickListener {
            moveToCurrentLocation()
        }

        // Start Navigation button
        binding.btnStartNavigation.setOnClickListener {
            Toast.makeText(this, "Navigation starting...", Toast.LENGTH_SHORT).show()
            // TODO: Implement actual navigation
        }
    }

    private fun performSearch() {
        val searchText = binding.etSearch.text.toString().trim()

        if (searchText.isEmpty()) {
            Toast.makeText(this, "Please enter a location", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            // Use Geocoder to convert address to coordinates
            val addresses: List<Address>? = geocoder.getFromLocationName(searchText, 1)

            if (addresses != null && addresses.isNotEmpty()) {
                val address = addresses[0]
                val location = LatLng(address.latitude, address.longitude)

                // Clear previous markers
                googleMap.clear()

                // Add marker at searched location
                googleMap.addMarker(
                    MarkerOptions()
                        .position(location)
                        .title(searchText)
                )

                // Move camera to location
                googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(location, 15f))

                // Show route info card
                binding.cardRouteInfo.visibility = android.view.View.VISIBLE
                binding.tvDestinationName.text = address.getAddressLine(0) ?: searchText

                // Calculate distance from current location
                calculateDistance(location)

                Toast.makeText(this, "Location found!", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Location not found", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun checkLocationPermission() {
        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            // Permission granted
            enableMyLocation()
        } else {
            // Request permission
            requestPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        }
    }

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            enableMyLocation()
        } else {
            Toast.makeText(
                this,
                "Location permission is required for navigation",
                Toast.LENGTH_LONG
            ).show()
        }
    }

    private fun enableMyLocation() {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            googleMap.isMyLocationEnabled = true
            moveToCurrentLocation()
        }
    }

    private fun moveToCurrentLocation() {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            checkLocationPermission()
            return
        }

        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null) {
                val currentLatLng = LatLng(location.latitude, location.longitude)
                googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(currentLatLng, 15f))
                Toast.makeText(this, "Moved to your location", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Unable to get current location", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun calculateDistance(destination: LatLng) {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            binding.tvDistance.text = "-- km"
            binding.tvDuration.text = "-- mins"
            return
        }

        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null) {
                val currentLatLng = LatLng(location.latitude, location.longitude)

                // Calculate straight-line distance
                val results = FloatArray(1)
                android.location.Location.distanceBetween(
                    currentLatLng.latitude,
                    currentLatLng.longitude,
                    destination.latitude,
                    destination.longitude,
                    results
                )

                val distanceKm = results[0] / 1000
                val estimatedTime = (distanceKm / 40 * 60).toInt() // Assuming 40 km/h average

                binding.tvDistance.text = String.format("%.1f km", distanceKm)
                binding.tvDuration.text = "$estimatedTime mins"
            }
        }
    }
}
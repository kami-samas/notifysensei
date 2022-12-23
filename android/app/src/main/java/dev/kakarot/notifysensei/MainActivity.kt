package dev.kakarot.notifysensei

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

//        val domain = findViewById<TextView>(R.id.editTextDomain)
//        val key = findViewById<TextView>(R.id.editTextKey)

//        val loginButton = findViewById<Button>(R.id.cirLoginButton)
//        loginButton.setOnClickListener() {
//            if (domain.text.isNullOrEmpty() || key.text.isNullOrEmpty()) {
//                Toast.makeText(baseContext, "Enter Both The Values", Toast.LENGTH_LONG).show()
//            } else {
//                Toast.makeText(baseContext, "Logged In", Toast.LENGTH_LONG).show()
//                setContentView(R.layout.activity_logged_in)
//            }
//        }
    }
}
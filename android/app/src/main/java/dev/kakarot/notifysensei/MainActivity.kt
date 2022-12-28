package dev.kakarot.notifysensei

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity
import org.json.JSONObject
import dev.kakarot.notifysensei.utils.makeHttpPostRequest

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val domain = findViewById<TextView>(R.id.input_domain)
        val key = findViewById<TextView>(R.id.input_key)

        val loginButton = findViewById<Button>(R.id.cirLoginButton)
        loginButton.setOnClickListener() {
            if (domain.text.isNullOrEmpty() || key.text.isNullOrEmpty()) {
                Toast.makeText(baseContext, getString(R.string.toast_both_val), Toast.LENGTH_LONG).show()
            } else {
                val response = makeHttpPostRequest(baseContext, domain.text.toString(), JSONObject().put("key", key.toString()))
                Toast.makeText(baseContext, response, Toast.LENGTH_LONG).show()
            }
        }
    }
}
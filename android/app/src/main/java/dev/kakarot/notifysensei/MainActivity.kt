package dev.kakarot.notifysensei

import android.os.Build
import android.os.Bundle
import android.os.StrictMode
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.databinding.DataBindingUtil
import com.google.firebase.FirebaseApp
import dev.kakarot.notifysensei.databinding.ActivityLoggedInBinding
import dev.kakarot.notifysensei.utils.getInstallationToken
import dev.kakarot.notifysensei.utils.makeHttpPostRequestAsync
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

class MainActivity : ComponentActivity() {
    private lateinit var binding: ActivityLoggedInBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FirebaseApp.initializeApp(this)
        val SDK_INT: Int = Build.VERSION.SDK_INT
        if (SDK_INT > 8) {
            val policy = StrictMode.ThreadPolicy.Builder()
                .permitAll().build()
            StrictMode.setThreadPolicy(policy)
    }
        val sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)
        getInstallationToken({ token ->
            val editor = sharedPreferences.edit()
            editor.putString("token", token)
            editor.apply()
            Toast.makeText(this@MainActivity, "$token", Toast.LENGTH_LONG).show()
        }, {})
        if (sharedPreferences.contains("id")) {
            binding = DataBindingUtil.setContentView(this, R.layout.activity_logged_in)
            binding.userId.text = "ID: ${sharedPreferences.getString("id", "000000000")}"
            binding.userKey.text = sharedPreferences.getString("key", "invalid")

            val logoutButton = findViewById<Button>(R.id.cirLogoutButton)
            val sendToken = findViewById<Button>(R.id.cirSendToken)
            logoutButton.setOnClickListener {
                val editor = sharedPreferences.edit()
                editor.clear()
                editor.apply()
                recreate()
            }
            sendToken.setOnClickListener {
                val jsonObj = JSONObject()
                jsonObj.put("key", sharedPreferences.getString("key", "invalid"))
                jsonObj.put("token", sharedPreferences.getString("token", "invalid"))
                GlobalScope.launch {
                    try {
                        val tokenResponse = makeHttpPostRequestAsync(
                            "${sharedPreferences.getString("domain", "http://0.0.0.0")}/s/token",
                            jsonObj
                        ).await()
                        val message: String;
                        withContext(Dispatchers.Main) {
                            message = try {
                                if (tokenResponse.toString() == "{}") {
                                    "Empty response"
                                } else {
                                    "${tokenResponse.getString("message")}"
                                }
                            } catch (e: JSONException) {
                                "Error: $e.message"
                            }
                            Toast.makeText(
                                this@MainActivity,
                                message,
                            Toast.LENGTH_LONG
                            ).show()
                        }
                    } catch (e: IOException) {
                        withContext(Dispatchers.Main) {
                            Toast.makeText(
                                baseContext,
                                "IOException: ${e.message.toString()}",
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    }
                }
            }
        } else {
            setContentView(R.layout.activity_login)
            val domain = findViewById<TextView>(R.id.input_domain)
            val key = findViewById<TextView>(R.id.input_key)

            val loginButton = findViewById<Button>(R.id.cirLoginButton)
            loginButton.setOnClickListener {
                if (domain.text.isNullOrEmpty() || key.text.isNullOrEmpty()) {
                    Toast.makeText(baseContext, getString(R.string.both_val_null), Toast.LENGTH_LONG).show()
                } else {
                    val jsonObj = JSONObject()
                    jsonObj.put("key", key.text.toString())
                    GlobalScope.launch {
                        try {
                            val verifyResponseReq = makeHttpPostRequestAsync(
                                "${domain.text}/s/verify",
                                jsonObj,
                            ).await()

                            withContext(Dispatchers.Main) {
                                val id = verifyResponseReq.getString("id")
                                Toast.makeText(this@MainActivity, "${verifyResponseReq.getString("message")} with ${id}", Toast.LENGTH_LONG).show()
                                val editor = sharedPreferences.edit()
                                editor.putString("id", id)
                                editor.putString("domain", domain.text.toString())
                                editor.putString("key", key.text.toString())
                                editor.apply()
                                recreate()
                            }
                        } catch (e: IOException) {
                            withContext(Dispatchers.Main) {
                                Toast.makeText(
                                    baseContext,
                                    "IOException: ${e.message.toString()}",
                                    Toast.LENGTH_LONG
                                ).show()
                            }
                        }
                    }
                }
            }
        }
    }
}
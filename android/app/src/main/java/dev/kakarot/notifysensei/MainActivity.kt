package dev.kakarot.notifysensei

import android.os.Build
import android.os.Bundle
import android.os.StrictMode
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.databinding.DataBindingUtil
import dev.kakarot.notifysensei.databinding.ActivityLoggedInBinding
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
        val SDK_INT: Int = Build.VERSION.SDK_INT
        if (SDK_INT > 8) {
            val policy = StrictMode.ThreadPolicy.Builder()
                .permitAll().build()
            StrictMode.setThreadPolicy(policy)
    }
        val sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)

        if (sharedPreferences.contains("id")) {
            binding = DataBindingUtil.setContentView(this, R.layout.activity_logged_in)
            binding.userId.text = "ID: ${sharedPreferences.getString("id", "000000000")}"
            binding.userKey.text = sharedPreferences.getString("key", "invalid")

            val logoutButton = findViewById<Button>(R.id.cirLogoutButton)
            logoutButton.setOnClickListener {
                val editor = sharedPreferences.edit()
                editor.clear()
                editor.apply()
                recreate()
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
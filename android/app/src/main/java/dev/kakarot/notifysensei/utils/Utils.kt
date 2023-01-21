package dev.kakarot.notifysensei.utils

import android.content.Context
import android.util.Log
import com.google.android.gms.tasks.OnCompleteListener
import com.google.firebase.installations.FirebaseInstallations
import com.google.firebase.messaging.FirebaseMessaging
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import okhttp3.*
import org.json.JSONObject


fun makeHttpPostRequestAsync(url: String, jsonBody: JSONObject): Deferred<JSONObject> {
   return GlobalScope.async {
        val client = OkHttpClient()

        val requestBody = RequestBody.create(
            MediaType.parse("application/json; charset=utf-8"),
            jsonBody.toString()
        )

        val request = Request.Builder()
            .url(url)
            .post(requestBody)
            .build()

        val response = client.newCall(request).execute()
        val statusCode = response.code()
        // Check if the request was successful
        if (statusCode == 200) {
            val responseBody = response.body()?.string()
            return@async JSONObject(responseBody)
        } else {
            return@async JSONObject()
        }
    }
}



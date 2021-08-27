# certificate_data_web
Node.js REST server that quieries a web server for TLS certificate infomation and returns the fingerprint.  Works well with Ardunio WiFiClient to set the fingerprint in WiFiSecureClient:

```
const char* fingerprint_server = "192.168.1.11";      //Server running certificate_data_web docker container
const char* fingerprint_resource = "/fingerprint/";   //URL to the service

String fingerprint = getFingerPrint("github.com");
char buf[fingerprint.length() + 1];
fingerprint.toCharArray(buf, sizeof(buf));
   
WiFiClientSecure secureClient;
secureClient.setFingerprint(buf);
...
```

```
String getFingerprint(String server) {
  String fingerprint;
  
  Serial.print("Retreiving fingerprint for ");
  Serial.println(server);
  
  WiFiClient client;
  if (client.connect(fingerprint_server, 8080)) {
    Serial.print("Connected to ");
    Serial.println(fingerprint_server);

    Serial.print("Requesting URL: ");
    Serial.print(fingerprint_resource);
    Serial.println(server);
    
    client.print(String("GET ") + fingerprint_resource + server +
      " HTTP/1.1\r\n" +
      "Host: " + fingerprint_server + "\r\n" + 
      "Connection: close\r\n\r\n");
    delay(500);

    while (client.available()) {
      fingerprint = client.readStringUntil('\r');     
      fingerprint.trim();
    }
  }
  fingerprint.replace(":", " ");
  Serial.print("Fingerprint: ");
  Serial.println(fingerprint);
  return fingerprint;
}
```

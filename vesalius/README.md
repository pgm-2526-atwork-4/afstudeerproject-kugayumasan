# 🩺 Vesalius — AI Consultation Assistant

---

## 🎯 DOEL VAN DE APPLICATIE

Vesalius is een mobiele applicatie gebouwd met **Expo + React Native** die artsen helpt bij het **automatisch documenteren van consultaties**.

De app:

- zet spraak om naar tekst in realtime  
- bouwt automatisch een transcript op  
- genereert AI-samenvattingen  
- vermindert administratieve workload  

➡️ Dit project is ontwikkeld als een **productiegerichte applicatie**, niet als prototype.

---

## ✨ FUNCTIONALITEITEN

### 🧠 CORE FEATURES

- 🎤 Realtime speech-to-text  
- 📝 Live transcript opbouw  
- 🤖 AI samenvattingen  
- 📂 Consultatiebeheer  
- 📄 Detail scherm met transcript  

---

## 📡 REALTIME FLOW
# 🩺 Vesalius — AI Consultation Assistant

---

## 🎯 DOEL VAN DE APPLICATIE

Vesalius is een mobiele applicatie gebouwd met **Expo + React Native** die artsen helpt bij het **automatisch documenteren van consultaties**.

De app:

- zet spraak om naar tekst in realtime  
- bouwt automatisch een transcript op  
- genereert AI-samenvattingen  
- vermindert administratieve workload  

➡️ Dit project is ontwikkeld als een **productiegerichte applicatie**, niet als prototype.

---

## ✨ FUNCTIONALITEITEN

### 🧠 CORE FEATURES

- 🎤 Realtime speech-to-text  
- 📝 Live transcript opbouw  
- 🤖 AI samenvattingen  
- 📂 Consultatiebeheer  
- 📄 Detail scherm met transcript  

---

## 📡 REALTIME FLOW

User spreekt
↓
VoiceKit (speech → text)
↓
sendTranscriptChunk
↓
finalizeTranscript
↓
AI summary (backend)


---

## 🚀 EXTRA FEATURES

### 🎙️ Native speech recognition

- realtime transcriptie op device  
- geen WebSocket nodig  
- lage latency  

➡️ sneller en stabieler

---

### 🔄 Live backend sync

- transcript wordt continu verstuurd  
- geen audio upload nodig  

➡️ betere UX

---

### 📡 Realtime events (Pusher)

- luistert naar:
  - consultation_notes.generated.success  
- automatische refresh  

➡️ geen polling nodig

---

## 🧱 ARCHITECTUUR

- duidelijke scheiding tussen UI en logic  
- services voor API calls  
- containers voor business logic  

➡️ schaalbaar en onderhoudbaar

---

## 🏗️ PROJECTSTRUCTUUR


src/
├── app/
├── components/
│ └── functional/
├── design/
│ └── screens/
├── core/
│ └── modules/
│ ├── recording/
│ ├── conversation/
│ └── realtime/


---

## 🛠️ TECH STACK

### 📱 FRONTEND

- Expo  
- React Native  
- Expo Router  
- VoiceKit  
- React Hooks  

---

### 🌐 BACKEND

- Vesalius API  
- Pusher (realtime)  
- AI processing  

---

## 🔐 SECURITY

- Keycloak authenticatie  
- veilige API communicatie  
- geen gevoelige data lokaal  

---

## ▶️ INSTALLATIE

### Vereisten

- Node.js  
- Android Studio  
- Expo account  

---

### Install


npm install


---

### Environment

Maak `.env`:


EXPO_PUBLIC_API_URL=...
EXPO_PUBLIC_KEYCLOAK_URL=...
EXPO_PUBLIC_KEYCLOAK_REALM=...
EXPO_PUBLIC_KEYCLOAK_CLIENT_ID=...


---

## ▶️ DEVELOPMENT BUILD (BELANGRIJK)


npx expo prebuild
npx expo run:android


❗ Werkt NIET in Expo Go  
➡️ native modules nodig

---

## 📦 ANDROID APK BUILD

### Setup


npm install -g eas-cli
eas login


---

### Config


npx expo install expo-dev-client
eas build:configure


---

### eas.json


{
"build": {
"production": {
"android": {
"buildType": "apk"
}
}
}
}


---

### Build


eas build -p android


---

### Install

- download APK  
- open op Android  
- installeer  

---

## ⚠️ BELANGRIJK

- werkt niet in Expo Go  
- speech vereist native build  
- AI summary kan delay hebben  

---

## 🧠 LEARNINGS

- native modules ≠ Expo Go  
- realtime apps vereisen andere flow  
- chunk-based transcriptie werkt beter  

---

## 👊 CONCLUSIE

Vesalius is een productiegerichte app die:

- realtime speech-to-text gebruikt  
- AI samenvattingen integreert  
- schaalbare architectuur toepast  

➡️ een realistische medische workflow
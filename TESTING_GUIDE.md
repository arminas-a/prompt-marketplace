# Greitasis Testavimo Gidas

## 1. Purchase Page Testavimas

**Žingsniai:**
1. Eikite į bet kurį prompt puslapį
2. Nupirkite promptą (arba naudokite egzistuojantį access token)
3. Eikite į `/purchase/[your-access-token]`
4. Patikrinkite:
   - ✅ Puslapis kraunasi be klaidos
   - ✅ Matote prompt tekstą
   - ✅ "Copy to Clipboard" mygtukas veikia
   - ✅ Po copy rodo "✓ Copied!" 2 sekundes

**Access token lokacija:**
- Account puslapyje: "View Prompt" nuoroda
- Email laiške: "View Your Prompt Anytime" nuoroda
- Format: `/purchase/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## 2. Persistent Session Testavimas

**Žingsniai:**
1. Prisijunkite prie sistemos
2. Perkraukite puslapį (F5)
3. Patikrinkite ar vis dar esate prisijungę
4. Uždarykite tab'ą
5. Atidarykite naują tab'ą su ta pačia URL
6. Patikrinkite ar vis dar prisijungę

**Expected rezultatas:**
- ✅ Lieki prisijungęs po perkrovimo
- ✅ Lieki prisijungęs po tab uždarymo
- ✅ Session išlieka kelias dienas

---

## 3. Dublikatų Prevencijos Testavimas

**Žingsniai:**
1. Prisijunkite prie account
2. Pasirinkite prompt'ą kurį JU pirko
3. Bandykite pirkti dar kartą
4. Turėtumėte matyti alert: "You have already purchased this prompt!"

**Alternatyvus testas:**
1. Bandykite pirkti kaip guest su tuo pačiu email
2. Turėtumėte matyti: "This email has already purchased this prompt!"

---

## 4. Email Testavimas

**Jau veikia!** Bet galite patikrinti:
1. Nupirkite test prompt'ą
2. Patikrinkite email inbox
3. Turėtumėte gauti:
   - ✅ Teisingą prompt title
   - ✅ Visą prompt tekstą
   - ✅ Working "View Your Prompt Anytime" link

---

## 5. HTTPS Setup (Optional, bet rekomenduojamas)

### Quick ngrok setup:

```bash
# Terminal 1 - Start dev server
npm run dev

# Terminal 2 - Start ngrok
ngrok http 3000
```

**Po ngrok paleidimo:**
1. Nukopijuokite HTTPS URL (pvz., https://abc123.ngrok.io)
2. Update `.env.local`:
   ```
   NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
   ```
3. Restart dev server (Terminal 1)

### Stripe webhook su ngrok:
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://abc123.ngrok.io/api/webhook`
3. Select: `checkout.session.completed`
4. Copy signing secret į `.env.local`

---

## Quick Test Commands

```bash
# Check if server is running
curl http://localhost:3000

# Check API health
curl http://localhost:3000/api/test-email

# View logs
# Check terminal where `npm run dev` is running
```

---

## Troubleshooting

### Purchase page klaida:
- ✅ **IŠSPRĘSTA** - Pusapis dabar client component

### Session nepersistentuoja:
- ✅ **IŠSPRĘSTA** - Pridėta persistSession config
- Patikrinkite browser localStorage (F12 → Application → Local Storage)
- Turėtumėte matyti supabase keys

### Dublikatų pirkimas:
- ✅ **JAU VEIKĖ** - BuyButton tikrina
- Jei vis dar veikia pirkti, patikrinkite browser console errors

### HTTPS klaidos:
- Naudokite ngrok
- Žiūrėkite `HTTPS_SETUP.md` full instrukcijoms

---

## Success Kriterijai

| Testas | Laukiamas Rezultatas |
|--------|---------------------|
| Purchase page | Kraunasi be klaidų, copy veikia |
| Session | Lieka prisijungęs po reload |
| Dublikatai | Blokuoja antrą pirkimą |
| Email | Ateina su teisingais duomenimis |
| Account page | Rodo visus pirkimus |

---

## Greitasis Patikrinimas (1 min)

```bash
# 1. Start server
npm run dev

# 2. Open browser
# http://localhost:3000

# 3. Login ir bandyk:
# - View purchased prompt
# - Copy prompt text
# - Reload page (check if still logged in)
# - Try to buy same prompt again
```

Viskas turėtų veikti! 🚀

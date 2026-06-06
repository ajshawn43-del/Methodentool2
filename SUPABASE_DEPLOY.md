# Supabase Backend Deployment

Dieser Guide zeigt Ihnen, wie Sie das Supabase Backend deployen.

## Schritt 1: Supabase Projekt erstellen

1. Gehen Sie zu https://supabase.com
2. Klicken Sie auf "New Project"
3. Wählen Sie einen Namen und ein Passwort
4. Region: Frankfurt (eu-central-1) empfohlen
5. Warten Sie 2-3 Minuten bis das Projekt bereit ist

## Schritt 2: Environment Variablen für Netlify

In Ihrem Supabase Dashboard (Settings → API):

1. **VITE_SUPABASE_URL**: Kopieren Sie "Project URL"
   - Sieht aus wie: `https://xxxxx.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**: Kopieren Sie "anon public"
   - Beginnt mit: `eyJhbGciOiJIUzI1NiI...`

### In Netlify eintragen:

1. Gehen Sie zu Netlify → Site settings → Environment variables
2. Klicken Sie auf "Add a variable"
3. Tragen Sie beide Variablen ein:
   - Key: `VITE_SUPABASE_URL` / Value: Ihre URL
   - Key: `VITE_SUPABASE_ANON_KEY` / Value: Ihr Key
4. Klicken Sie auf "Save"

## Schritt 3: Edge Function deployen

### Option A: Mit Supabase CLI (empfohlen)

```bash
# 1. Installieren Sie Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link zu Ihrem Projekt
supabase link --project-ref YOUR_PROJECT_REF

# 4. Deploy Edge Function
supabase functions deploy make-server-aac39e77 --project-ref YOUR_PROJECT_REF
```

**Ihre Project REF finden Sie:** Supabase Dashboard → Settings → General → Reference ID

### Option B: Manuell über Supabase Dashboard

1. Gehen Sie zu: Edge Functions → "Create a new function"
2. Name: `make-server-aac39e77`
3. Kopieren Sie den Code aus: `supabase/functions/server/index.tsx`
4. Klicken Sie auf "Deploy"

## Schritt 4: Testen

Öffnen Sie in Ihrem Browser:
```
https://[IHR-PROJEKT-ID].supabase.co/functions/v1/make-server-aac39e77/health
```

**Erfolg:** Sie sehen `{"status":"ok"}`

## Schritt 5: Netlify neu deployen

1. Gehen Sie zu Netlify → Deploys
2. Klicken Sie auf "Trigger deploy" → "Clear cache and deploy site"
3. Warten Sie 2-3 Minuten

✅ **Fertig!** Ihre App läuft jetzt mit vollem Backend!

## Features nach Deployment:

- ✅ PowerPoint Upload
- ✅ Methoden persistent speichern
- ✅ Likes über alle Geräte synchronisiert
- ✅ Comments speichern
- ✅ Pins synchronisieren

## Troubleshooting

### "Backend nicht verfügbar"
- Prüfen Sie, ob die Environment Variablen korrekt in Netlify eingetragen sind
- Testen Sie die Edge Function URL im Browser

### "CORS Error"
- Stellen Sie sicher, dass der CORS-Code in der Edge Function enthalten ist
- Netlify neu deployen

### Build-Fehler
- Prüfen Sie die Netlify Build Logs
- Stellen Sie sicher, dass `netlify.toml` vorhanden ist

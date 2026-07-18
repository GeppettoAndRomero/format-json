import type { ToolContent } from './types';

// Deutsch. Keine Wort-für-Wort-Übersetzung, sondern Transkreation auf Basis der
// Begriffe und Wendungen, die deutsche JSON-Formatierungstools tatsächlich verwenden.
// Keine Werbefloskeln (einfach / schnell / kinderleicht / perfekt) — Datenschutz wird
// strukturell begründet, nicht versprochen (BRAND-OPERATING-MODEL / I18N-SEO-GUIDELINE).

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'JSON formatieren — Pretty-Print, Minifizieren & Validieren, ohne Upload | runlocally',
    description:
      'JSON direkt im Browser formatieren (Pretty-Print), minifizieren oder validieren. Ungültiges JSON zeigt Zeile und Spalte des Fehlers. Nichts wird hochgeladen — Open Source, funktioniert offline.',
    ogTitle: 'JSON formatieren — Pretty-Print, Minifizieren & Validieren',
    ogDescription:
      'JSON im Browser formatieren, minifizieren oder validieren. Fehler zeigen die genaue Zeile und Spalte. Nichts wird hochgeladen.',
  },

  hero: {
    h1: 'JSON formatieren',
    tagline:
      'JSON im Browser formatieren, minifizieren oder validieren — bei ungültigem JSON wird genau gezeigt, wo es hakt. Nichts wird hochgeladen.',
  },

  intro: {
    h2: 'JSON formatieren, minifizieren oder validieren, ohne den Browser zu verlassen',
    paras: [
      'JSON einfügen, direkt eintippen, oder eine .json-Datei auswählen. Mit "Formatieren" wird mit 2 Leerzeichen, 4 Leerzeichen oder einem Tabulator eingerückt; "Minimieren" entfernt jedes nicht notwendige Leerzeichen und jeden Zeilenumbruch; "Validieren" prüft nur, ob es sich parsen lässt, ohne etwas umzuschreiben.',
      'Zum Parsen wird der im Browser eingebaute JSON.parse verwendet — derselbe Parser, den auch dein Code zur Laufzeit nutzt. Was hier als gültig erkannt wird, ist also überall gültig. Ist es ungültig, wird genau die Fehlermeldung angezeigt, die der Browser tatsächlich geworfen hat, zusammen mit der Zeile und Spalte, auf die sie zeigt — nicht geraten.',
    ],
  },

  privacy: {
    h2: 'Warum dein JSON auf deinem Gerät bleibt',
    lead: 'Datenschutz ist hier strukturell, kein Versprechen. Es gibt keinen Upload-Schritt, weil es keinen Server gibt, an den hochgeladen werden könnte — das ist hier besonders wichtig, da JSON, das in ein Formatierungstool eingefügt wird, oft eine echte API-Antwort, eine Konfigurationsdatei oder Daten mit Tokens sind, die man nirgendwohin senden möchte:',
    points: [
      'Parsen, Formatieren, Minimieren und Validieren laufen vollständig im Browser ab.',
      'Die Seite wird als statische Dateien ausgeliefert und sendet keine Anfrage mit deinen JSON-Daten.',
      'Der Quellcode ist offen einsehbar (MIT).',
      'Es funktioniert offline — nur möglich, weil nichts das Gerät verlässt.',
    ],
    note: 'Zum Selbst-Überprüfen: Öffne beim Formatieren das Netzwerk-Panel deines Browsers — keine Anfrage transportiert deine Daten.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'JSON eingeben',
        p: 'In das Textfeld einfügen, direkt eintippen, oder auf "Datei auswählen" klicken für eine .json-Datei. Eine Datei irgendwo auf der Seite abzulegen funktioniert ebenso.',
      },
      {
        h3: 'Modus wählen',
        p: '"Formatieren" gibt mit der gewählten Einrückung (2 Leerzeichen, 4 Leerzeichen oder Tabulator) eine lesbare Ausgabe. "Minimieren" entfernt jedes nicht notwendige Leerzeichen. "Validieren" prüft nur, ob es sich parsen lässt.',
      },
      {
        h3: 'Fehler beheben, falls vorhanden',
        p: 'Bei ungültigem JSON werden genau die Zeile und Spalte angezeigt, die der Browser gemeldet hat, zusammen mit der betroffenen Zeile — so lässt sich das Problem schnell finden und beheben.',
      },
      {
        h3: 'Ergebnis kopieren oder herunterladen',
        p: 'Das formatierte oder minimierte Ergebnis in die Zwischenablage kopieren oder als .json-Datei herunterladen. Die Byte-Größen von Eingabe und Ausgabe werden angezeigt, damit genau ersichtlich ist, wie viel das Minimieren eingespart hat.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Wird mein JSON irgendwohin hochgeladen?',
      a: 'Nein. Parsen, Formatieren, Minimieren und Validieren laufen vollständig im Browser ab. Es gibt keine Server-Komponente, deine Daten haben also keinen Weg, das Gerät zu verlassen. Der Quellcode ist offen einsehbar, und du kannst das im Netzwerk-Panel deines Browsers selbst überprüfen.',
    },
    {
      q: 'Was ist der Unterschied zwischen Formatieren, Minimieren und Validieren?',
      a: '"Formatieren" gibt dein JSON mit einer einheitlichen Einrückung (2 Leerzeichen, 4 Leerzeichen oder Tabulator) lesbar aus. "Minimieren" macht das Gegenteil: Es entfernt jedes Leerzeichen, jeden Tabulator und jeden Zeilenumbruch, den JSON nicht zwingend braucht, für die kleinstmögliche gültige Ausgabe. "Validieren" tut keines von beidem — es parst lediglich die Eingabe und meldet, ob sie gültiges JSON ist, und bei Fehlern, wo genau es hakt.',
    },
    {
      q: 'Wie wird die Fehlerposition ermittelt?',
      a: 'Sie stammt direkt aus dem eingebauten JSON-Parser des Browsers, JSON.parse — die exakte Meldung, die er wirft, wird angezeigt, mit Zeile und Spalte abgeleitet aus der Stelle im Text, auf die sie zeigt. Verschiedene Browser formulieren diese Meldungen unterschiedlich, manche geben gar keine genaue Position preis; in diesem Fall wird die rohe Meldung angezeigt, statt eine Position zu raten.',
    },
    {
      q: 'Verändert Formatieren oder Minimieren die Daten selbst?',
      a: 'Nein. Nur Leerraum ändert sich. Die Reihenfolge der Objektschlüssel und jeder Wert bleiben genau so erhalten, wie sie der JSON-Parser des Browsers liest — nichts wird umsortiert, hinzugefügt oder entfernt.',
    },
    {
      q: 'Gibt es ein Limit für die Dateigröße?',
      a: 'Es gibt kein festes Limit. Da alles im Browser läuft, hängt die praktische Grenze vom Arbeitsspeicher deines Geräts ab — sehr große Dateien brauchen möglicherweise einfach länger zum Parsen oder Formatieren.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja. Es ist eine PWA. Nach dem ersten Besuch wird sie zwischengespeichert, sodass Formatieren und Validieren auch ohne Netzwerkverbindung funktionieren. Du kannst sie außerdem auf deinem Startbildschirm installieren.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Entwickelt und gepflegt von Geppetto. Ein Teil des Codes entsteht mit KI-Unterstützung; Review und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },
};

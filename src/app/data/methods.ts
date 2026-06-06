export interface Method {
  id: string;
  title: string;
  category: string;
  duration: string;
  participants: string;
  description: string;
  goal: string;
  steps: {
    title: string;
    description: string;
  }[];
  tips: string[];
  // WICHTIG: Keywords werden für die Suchfunktion verwendet!
  // Die Suchleiste auf der Homepage durchsucht alle Keywords automatisch.
  // Um neue Keywords hinzuzufügen: Einfach hier im Array ergänzen (siehe Beispiele unten)
  keywords: string[];
  pdfPages?: string;
  imageUrl: string;
  contactPerson: {
    name: string;
    role: string;
    email: string;
    avatar?: string;
  };
  examples?: string[];
}

export const methods: Method[] = [
  {
    id: '1',
    title: 'Four Sides of Communication',
    category: 'Kommunikation',
    duration: '15-30 Min',
    participants: '2-8 Personen',
    description: 'Hilft dabei, Nachrichten besser zu verstehen, da jede Aussage vier Seiten haben kann: Sachebene, Selbstoffenbarung, Beziehung und Appell.',
    goal: 'Missverständnisse in der Kommunikation erkennen und klären, indem alle Ebenen einer Nachricht betrachtet werden.',
    // KEYWORDS: Werden für die Suchfunktion verwendet. Einfach weitere Begriffe hinzufügen, nach denen Nutzer suchen könnten.
    // Beispiel: Nutzer sucht "Sender" → Diese Methode wird gefunden
    keywords: ['Kommunikation', 'Nachrichten', 'Missverständnisse', 'Sachebene', 'Selbstoffenbarung', 'Beziehung', 'Appell', 'Vier Seiten', 'Sender', 'Empfänger', 'Aktives Zuhören'],
    pdfPages: '3-7',
    imageUrl: '/grafik-1.png',
    contactPerson: {
      name: 'Dr. Anna Müller',
      role: 'Kommunikationsexpertin',
      email: 'a.mueller@beispiel.de'
    },
    examples: [
      'Eine Kollegin sagt: "Das Projekt läuft ja gut." → Sachebene: Information über Projektstatus | Selbstoffenbarung: Sie ist zufrieden | Beziehung: Wertschätzende Rückmeldung | Appell: Weiter so machen',
      'Ein Vorgesetzter fragt: "Haben Sie schon Feierabend?" → Sachebene: Frage nach Arbeitszeit | Selbstoffenbarung: Überraschung/Verwunderung | Beziehung: Subtile Kritik | Appell: Bitte noch bleiben oder mehr arbeiten'
    ],
    steps: [
      {
        title: 'Aussage analysieren',
        description: 'Die konkrete Aussage oder Nachricht identifizieren, die untersucht werden soll.'
      },
      {
        title: 'Sachebene betrachten',
        description: 'Welche Sachinformation wird übermittelt? Worüber wird informiert?'
      },
      {
        title: 'Selbstoffenbarung erkennen',
        description: 'Was sagt der Sender über sich selbst aus? Welche Gefühle, Werte oder Motive werden offenbart?'
      },
      {
        title: 'Beziehungsebene prüfen',
        description: 'Wie steht der Sender zum Empfänger? Was wird über die Beziehung ausgesagt?'
      },
      {
        title: 'Appell identifizieren',
        description: 'Wozu möchte der Sender den Empfänger veranlassen? Was soll getan, gedacht oder gefühlt werden?'
      },
      {
        title: 'Missverständnisse klären',
        description: 'Unterschiede zwischen Sender-Intention und Empfänger-Interpretation erkennen und besprechen.'
      }
    ],
    tips: [
      'Besonders hilfreich bei wiederkehrenden Missverständnissen',
      'Alle vier Seiten gleichwertig betrachten',
      'Mit "Ich-Botschaften" arbeiten, um Schuldzuweisungen zu vermeiden',
      'Auch nonverbale Signale einbeziehen'
    ]
  },
  {
    id: '2',
    title: 'Circle of Influence',
    category: 'Selbstmanagement',
    duration: '20-40 Min',
    participants: '1-6 Personen',
    description: 'Hilft zu unterscheiden, was man kontrollieren, beeinflussen oder nur akzeptieren kann, um Energie auf das Wesentliche zu fokussieren.',
    goal: 'Den eigenen Einflussbereich erkennen und Ressourcen gezielt auf beeinflussbare Faktoren konzentrieren.',
    keywords: ['Selbstmanagement', 'Einfluss', 'Kontrolle', 'Akzeptanz', 'Prioritäten', 'Fokus', 'Energie', 'Einflusssphäre', 'Sorgenkreis'],
    pdfPages: '8-10',
    imageUrl: '/grafik-2.png',
    contactPerson: {
      name: 'Thomas Weber',
      role: 'Coach für Selbstmanagement',
      email: 't.weber@beispiel.de'
    },
    examples: [
      'Kontrolle: Meine Reaktion auf Stress, meine Zeitplanung, meine Kommunikation',
      'Einfluss: Teamdynamik durch aktive Beteiligung, Beziehungen zu Kollegen, Vorschläge für Prozessverbesserungen',
      'Sorge/Akzeptanz: Unternehmensstrategie, Marktbedingungen, Entscheidungen der Geschäftsführung'
    ],
    steps: [
      {
        title: 'Problem oder Situation definieren',
        description: 'Die aktuelle Herausforderung oder Situation klar beschreiben.'
      },
      {
        title: 'Kreise zeichnen',
        description: 'Drei konzentrische Kreise erstellen: Innerer Kreis (Kontrolle), mittlerer Kreis (Einfluss), äußerer Kreis (Sorge/Akzeptanz).'
      },
      {
        title: 'Faktoren sammeln',
        description: 'Alle relevanten Aspekte, Faktoren und Herausforderungen der Situation auflisten.'
      },
      {
        title: 'Faktoren einordnen',
        description: 'Jeden Faktor einem der drei Kreise zuordnen: Kann ich es vollständig kontrollieren? Kann ich es beeinflussen? Muss ich es akzeptieren?'
      },
      {
        title: 'Fokus setzen',
        description: 'Priorität auf die Kreise "Kontrolle" und "Einfluss" legen. Konkrete Handlungen für diese Bereiche ableiten.'
      },
      {
        title: 'Akzeptanz üben',
        description: 'Faktoren im äußeren Kreis bewusst akzeptieren oder Strategien entwickeln, um damit umzugehen.'
      }
    ],
    tips: [
      'Beginnen Sie mit dem inneren Kreis – dort haben Sie die größte Wirkung',
      'Der Einflusskreis kann durch aktives Handeln wachsen',
      'Energie auf den Sorgenkreis zu verwenden, ist meist unproduktiv',
      'Regelmäßig überprüfen, ob sich Faktoren zwischen den Kreisen verschoben haben'
    ]
  },
  {
    id: '3',
    title: 'MEP – Managing Expectations for Performance',
    category: 'Erwartungsmanagement',
    duration: '30-45 Min',
    participants: '2-4 Personen',
    description: 'Unterstützt dabei, Erwartungen klar zu formulieren, Commitment einzuholen und mögliche Hindernisse frühzeitig zu erkennen.',
    goal: 'Klare Erwartungen setzen und sicherstellen, dass alle Beteiligten verstehen, was erwartet wird und Hindernisse transparent machen.',
    keywords: ['Erwartungsmanagement', 'Commitment', 'Hindernisse', 'Performance', 'Zusammenarbeit', 'Motivation', 'Verständnis', 'Follow-up', 'Blocker'],
    pdfPages: '11-14',
    imageUrl: '/grafik-3.png',
    contactPerson: {
      name: 'Sarah Schmidt',
      role: 'Projektmanagement-Beraterin',
      email: 's.schmidt@beispiel.de'
    },
    examples: [
      'Erwartung: "Bitte erstellen Sie bis Freitag eine Präsentation mit den Quartalsergebnissen" → Commitment einholen: "Können Sie das bis Freitag schaffen?" → Hindernisse prüfen: Haben Sie die nötigen Daten? Verstehen Sie das Format? Gibt es andere Prioritäten?',
      'Problem Verständnis: Person wiederholt in eigenen Worten → Problem Motivation: Klären warum die Aufgabe wichtig ist → Problem Fähigkeiten: Fehlt Training in PowerPoint? → Follow-up: Treffen am Donnerstag zur Zwischenstandskontrolle'
    ],
    steps: [
      {
        title: 'Erwartetes Ergebnis formulieren',
        description: 'Konkret und messbar beschreiben, welches Ergebnis erwartet wird. Was soll erreicht werden?'
      },
      {
        title: 'Commitment einholen',
        description: 'Aktive Zustimmung der beteiligten Person(en) einholen. Können und wollen sie sich dazu verpflichten?'
      },
      {
        title: 'Verständnis prüfen',
        description: 'Sicherstellen, dass die Erwartung richtig verstanden wurde. Die Person wiederholt in eigenen Worten.'
      },
      {
        title: 'Motivation abklären',
        description: 'Gibt es ausreichend Motivation? Sind Anreize oder Unterstützung nötig?'
      },
      {
        title: 'Wissen & Fähigkeiten checken',
        description: 'Hat die Person die notwendigen Skills und Ressourcen? Wo wird ggf. Training oder Unterstützung benötigt?'
      },
      {
        title: 'Externe Blocker identifizieren',
        description: 'Welche externen Faktoren könnten die Umsetzung behindern? Wie können diese adressiert werden?'
      },
      {
        title: 'Follow-up vereinbaren',
        description: 'Klare Checkpoints und Feedback-Schleifen definieren, um den Fortschritt zu begleiten.'
      }
    ],
    tips: [
      'Je konkreter die Erwartung, desto besser',
      'Echtes Commitment ist mehr als nur "Ja sagen"',
      'Hindernisse früh erkennen spart später viel Zeit',
      'Regelmäßiges Follow-up erhöht die Erfolgswahrscheinlichkeit deutlich'
    ]
  },
  {
    id: '4',
    title: 'Handling Conflicts',
    category: 'Konfliktlösung',
    duration: '45-90 Min',
    participants: '2-10 Personen',
    description: 'Hilft dabei, Konflikte zu erkennen, einzuordnen und passende Lösungsstrategien auszuwählen, um konstruktiv damit umzugehen.',
    goal: 'Konflikte systematisch analysieren und eine angemessene Strategie zur Lösung finden.',
    keywords: ['Konfliktlösung', 'Konflikte', 'Streit', 'Vermeidung', 'Kompromiss', 'Zusammenarbeit', 'Win-Win', 'Mediation', 'Sachkonflikt', 'Beziehungskonflikt'],
    pdfPages: '15-18',
    imageUrl: '/grafik-4.png',
    contactPerson: {
      name: 'Michael Becker',
      role: 'Mediator & Konfliktberater',
      email: 'm.becker@beispiel.de'
    },
    examples: [
      'Sachebene (Goal Conflict): Zwei Teams wollen unterschiedliche Projektziele verfolgen → Lösung: Gemeinsame Zieldefinition, Kompromiss oder Priorisierung durch Management',
      'Beziehungsebene (Relationship Conflict): Zwei Kollegen können aufgrund persönlicher Antipathie nicht zusammenarbeiten → Lösung: Klärungsgespräch mit neutralem Moderator, gemeinsame Spielregeln definieren',
      'Rollenebene (Role Conflict): Unklare Verantwortlichkeiten führen zu Doppelarbeit oder Lücken → Lösung: Rollen und Zuständigkeiten klar dokumentieren und kommunizieren'
    ],
    steps: [
      {
        title: 'Konflikt erkennen',
        description: 'Den Konflikt klar benennen. Was ist das eigentliche Problem? Wer ist beteiligt?'
      },
      {
        title: 'Konfliktart bestimmen',
        description: 'Ist es ein Sachkonflikt, Beziehungskonflikt, Wertekonflikt oder Interessenkonflikt?'
      },
      {
        title: 'Ebenen unterscheiden',
        description: 'Sachliche Ebene (Fakten, Prozesse) und psychosoziale Ebene (Emotionen, Beziehungen) getrennt betrachten.'
      },
      {
        title: 'Strategie wählen',
        description: 'Passende Konfliktlösungsstrategie auswählen: Vermeidung, Anpassung, Kompromiss, Wettbewerb oder Zusammenarbeit/Kooperation.'
      },
      {
        title: 'Lösung erarbeiten',
        description: 'Gemeinsam an einer Lösung arbeiten. Bei Zusammenarbeit: Win-Win-Lösungen anstreben.'
      },
      {
        title: 'Vereinbarungen treffen',
        description: 'Konkrete Maßnahmen und Verhaltensänderungen vereinbaren und dokumentieren.'
      },
      {
        title: 'Nachhalten',
        description: 'Follow-up-Termin vereinbaren, um die Umsetzung zu überprüfen.'
      }
    ],
    tips: [
      'Konflikte früh ansprechen, bevor sie eskalieren',
      'Zusammenarbeit ist meist die nachhaltigste Strategie',
      'Bei emotionalen Konflikten erst die Gefühlsebene klären',
      'Neutraler Moderator kann bei festgefahrenen Situationen helfen',
      'Fokus auf Interessen statt Positionen legen'
    ]
  },
  {
    id: '5',
    title: 'Stakeholder Matrix',
    category: 'Stakeholder Management',
    duration: '30-60 Min',
    participants: '3-8 Personen',
    description: 'Hilft dabei, Stakeholder nach Einfluss und Interesse zu bewerten und passende Kommunikations- und Einbindungsmaßnahmen abzuleiten.',
    goal: 'Alle relevanten Stakeholder identifizieren, priorisieren und eine angemessene Engagement-Strategie entwickeln.',
    keywords: ['Stakeholder', 'Einfluss', 'Interesse', 'Matrix', 'Projektmanagement', 'Kommunikation', 'Engagement', 'Priorisierung', 'Key-Stakeholder'],
    pdfPages: '19-21',
    imageUrl: '/grafik-5.png',
    contactPerson: {
      name: 'Lisa Hoffmann',
      role: 'Stakeholder Relations Manager',
      email: 'l.hoffmann@beispiel.de'
    },
    examples: [
      'Hoher Einfluss + Hohes Interesse: Geschäftsführung, Projektsponsor → Strategie: Wöchentliche Updates, enge Abstimmung, in Entscheidungen einbinden',
      'Hoher Einfluss + Niedriges Interesse: CFO bei IT-Projekt → Strategie: Monatliche High-Level-Reports, über Budget informiert halten, zufriedenstellen',
      'Niedriger Einfluss + Hohes Interesse: Endnutzer, betroffene Teams → Strategie: Newsletter, Informationsveranstaltungen, Feedback-Kanäle',
      'Niedriger Einfluss + Niedriges Interesse: Externe Partner ohne direkte Berührung → Strategie: Auf Watchlist behalten, minimaler Aufwand'
    ],
    steps: [
      {
        title: 'Stakeholder sammeln',
        description: 'Alle Personen, Gruppen oder Organisationen auflisten, die vom Projekt betroffen sind oder es beeinflussen können.'
      },
      {
        title: 'Matrix erstellen',
        description: 'Zwei-Achsen-Matrix zeichnen: Einfluss (hoch/niedrig) und Interesse (hoch/niedrig).'
      },
      {
        title: 'Einfluss bewerten',
        description: 'Wie viel Macht/Einfluss hat der Stakeholder auf das Projekt? Kann er Entscheidungen blockieren oder vorantreiben?'
      },
      {
        title: 'Interesse bewerten',
        description: 'Wie stark ist der Stakeholder am Projekt interessiert? Wie sehr ist er betroffen?'
      },
      {
        title: 'Stakeholder einordnen',
        description: 'In vier Quadranten einordnen: Hoher Einfluss + Hohes Interesse (eng managen), Hoher Einfluss + Niedriges Interesse (zufriedenstellen), Niedriger Einfluss + Hohes Interesse (informieren), Niedriger Einfluss + Niedriges Interesse (beobachten).'
      },
      {
        title: 'Strategie ableiten',
        description: 'Für jeden Quadranten passende Kommunikations- und Einbindungsmaßnahmen definieren.'
      },
      {
        title: 'Umsetzung planen',
        description: 'Konkrete Aktionen, Verantwortlichkeiten und Zeitpläne festlegen.'
      }
    ],
    tips: [
      'Stakeholder können sich im Projektverlauf zwischen Quadranten bewegen',
      'Hoher Einfluss + Hohes Interesse: Diese sind Ihre Key-Stakeholder',
      'Unterschätzen Sie nicht die "Beobachten"-Gruppe – sie kann relevant werden',
      'Regelmäßig aktualisieren, besonders bei längeren Projekten'
    ]
  },
  {
    id: '6',
    title: 'Sociogram',
    category: 'Stakeholder Management',
    duration: '30-60 Min',
    participants: '3-10 Personen',
    description: 'Macht Beziehungen, Spannungen und Dynamiken zwischen Personen oder Gruppen visuell sichtbar und hilft, soziale Strukturen zu verstehen.',
    goal: 'Beziehungsgeflechte transparent machen und Ansatzpunkte für bessere Zusammenarbeit oder Konfliktlösung identifizieren.',
    keywords: ['Stakeholder', 'Beziehungen', 'Teamdynamik', 'Netzwerk', 'Spannungen', 'Soziogramm', 'Visualisierung', 'Brückenbauer', 'Allianzen', 'Team'],
    pdfPages: '22-24',
    imageUrl: '/grafik-6.png',
    contactPerson: {
      name: 'David Klein',
      role: 'Organisationsentwickler',
      email: 'd.klein@beispiel.de'
    },
    examples: [
      'In einem Projektteam zeigt das Sociogram: Paula (Projektleiterin) steht im Zentrum mit guten Beziehungen zu Johann und Sybille. Günther hat eine angespannte Beziehung zu Paula. Achim ist relativ isoliert.',
      'Erkenntnisse: Paula ist der Hub. Johann könnte als Brückenbauer zu Günther fungieren. Achim braucht bessere Integration ins Team.',
      'Maßnahmen: Konfliktgespräch zwischen Paula und Günther. Johann als Vermittler einsetzen. Achim gezielt in gemeinsame Aktivitäten einbinden.'
    ],
    steps: [
      {
        title: 'Relevante Personen auswählen',
        description: 'Alle wichtigen Akteure, Teams oder Gruppen identifizieren, die für das Thema relevant sind.'
      },
      {
        title: 'Personen darstellen',
        description: 'Jede Person/Gruppe als Kreis oder Symbol in einem Diagramm darstellen. Größe kann Einfluss/Bedeutung symbolisieren.'
      },
      {
        title: 'Beziehungen einzeichnen',
        description: 'Linien zwischen den Personen ziehen, um Beziehungen darzustellen.'
      },
      {
        title: 'Beziehung bewerten',
        description: 'Jede Beziehung bewerten und visualisieren: Gut/positiv (durchgezogene Linie), neutral (gestrichelt), angespannt/konfliktreich (wellig oder rot).'
      },
      {
        title: 'Muster erkennen',
        description: 'Zentrale Personen (Hubs), isolierte Personen, Brückenbauer, Cliquen oder Konfliktlinien identifizieren.'
      },
      {
        title: 'Dynamiken ableiten',
        description: 'Welche Spannungen gibt es? Wer hat Brückenfunktion? Wo sind Allianzen? Welche Kommunikationswege funktionieren?'
      },
      {
        title: 'Maßnahmen entwickeln',
        description: 'Konkrete Aktionen ableiten: Konfliktgespräche, Förderung bestimmter Beziehungen, Einbindung von Brückenbauern.'
      }
    ],
    tips: [
      'Besonders wertvoll bei komplexen Team- oder Organisationsstrukturen',
      'Vertraulich behandeln – sensible Informationen über Beziehungen',
      'Kann auch positive Aspekte zeigen: starke Allianzen, gute Netzwerke',
      'Kombinieren Sie mit der Stakeholder Matrix für umfassenderes Bild',
      'Regelmäßig aktualisieren, da sich Beziehungen verändern'
    ]
  }
];

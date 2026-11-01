# Roadmap-Drawer

Barrierearme Roadmap-Navigation mit Tastatursteuerung
Vom Button zum barrierearmen Roadmap-Drawer

Der Roadmap-Button öffnet ein seitlich einfahrendes Inhaltsverzeichnis, über das Besucher direkt zu den einzelnen Lektionen navigieren können.

Bei der Umsetzung wurde bewusst auf das native HTML-Element <dialog> zurückgegriffen. Anstatt ein eigenes Dialogsystem mit JavaScript nachzubauen, nutzen wir damit bereits vorhandene Funktionen des Browsers.

Das Dialogfenster wird mit der JavaScript-Methode showModal() geöffnet und mit close() wieder geschlossen. Durch die modale Darstellung wird der übrige Seiteninhalt während der geöffneten Navigation für die Interaktion gesperrt. Auch die Escape-Taste zum Schließen wird vom Browser nativ unterstützt.

1. HTML – Die semantische Grundlage

Der Roadmap-Button ist ein echtes HTML-<button>-Element. Dadurch ist er von Haus aus mit der Tastatur bedienbar und wird von Screenreadern als Schaltfläche erkannt.

Über aria-expanded wird zusätzlich der aktuelle Öffnungszustand vermittelt. aria-controls stellt eine Beziehung zwischen dem Button und dem zugehörigen Dialog her.

Das Inhaltsverzeichnis selbst wird mit <dialog> umgesetzt. Innerhalb des Dialogs sorgt ein <nav>-Element mit einer ungeordneten Liste aus Links für eine semantisch nachvollziehbare Navigation.

2. CSS – Gestaltung und Animation

Mit CSS wird aus dem Dialog ein seitlich einfahrendes Menü.

Die Eigenschaft transform: translateX(100%) verschiebt den geschlossenen Drawer zunächst außerhalb des sichtbaren Bereichs. Sobald der Dialog geöffnet wird, sorgt transform: translateX(0) dafür, dass er von rechts in den Bildschirm gleitet.

Mit ::backdrop wird gleichzeitig der Hintergrund abgedunkelt und leicht verschwommen dargestellt.

Eine Besonderheit ist die Verwendung von @starting-style und transition-behavior: allow-discrete. Dadurch lassen sich auch die sonst nicht kontinuierlich animierbaren Zustandswechsel des nativen Dialogelements in den Animationsablauf einbeziehen.

Für Menschen, die reduzierte Bewegung bevorzugen, berücksichtigt das CSS außerdem die Systemeinstellung prefers-reduced-motion.

3. JavaScript – Interaktion und Tastatursteuerung

JavaScript übernimmt die eigentliche Steuerung des Dialogs.

Beim Klick auf den Roadmap-Button wird zunächst geprüft, ob der Dialog bereits geöffnet ist. Anschließend wird showModal() aufgerufen und der Zustand von aria-expanded auf true gesetzt.

Gezielte Fokussteuerung

Nach dem Öffnen wird der Fokus gezielt gesetzt:

Ist eine Lektion als aktuell markiert (aria-current), erhält deren Link den Fokus.
Andernfalls wird der Schließen-Button fokussiert.

Besonders wichtig ist das Fokusmanagement. Ein geöffnetes modales Dialogfenster soll die Tastaturbedienung innerhalb des Dialogs halten.

Tastaturnavigation

Dafür wurde eine zusätzliche Tastatursteuerung implementiert:

Taste	Funktion
Tab	Zum nächsten Element springen
Shift + Tab	Zum vorherigen Element springen
↓ Pfeil runter	Zum nächsten Lektionseintrag springen
↑ Pfeil hoch	Zum vorherigen Lektionseintrag springen
Home	Zum ersten Lektionseintrag springen
End	Zum letzten Lektionseintrag springen
Escape	Dialog schließen

Bei der Navigation mit den Pfeiltasten wird am Ende der Liste wieder zum ersten Eintrag und umgekehrt gesprungen.

Wird der Dialog geschlossen, wird aria-expanded wieder auf false gesetzt. Zusätzlich sorgt die eigene Fokuslogik dafür, dass der Fokus zum Roadmap-Button zurückkehrt, sofern er sich noch im Dialog befindet oder auf dem Dokument liegt.

4. Warum diese Umsetzung barriereärmer ist

Bei interaktiven Elementen geht es nicht nur darum, dass sie mit der Maus funktionieren. Sie müssen auch ohne Maus bedienbar und für assistive Technologien nachvollziehbar sein.

Deshalb wurden verschiedene Aspekte berücksichtigt:

Native HTML-Elemente statt selbstgebauter Bedienelemente.
Aussagekräftige Beschriftungen über aria-label.
Zustandsinformationen über aria-expanded.
Eine nachvollziehbare Beziehung zwischen Button und Dialog über aria-controls.
Sichtbare Fokusmarkierungen über :focus-visible.
Eine gezielte Fokuspositionierung beim Öffnen und Schließen.
Eine zusätzliche Tastaturnavigation innerhalb der Lektionen.
Berücksichtigung der Systemeinstellung für reduzierte Animationen.
5. Fazit

Das Ergebnis ist eine Navigation, die sowohl mit der Maus als auch mit der Tastatur bedient werden kann.

Durch die Kombination nativer Browserfunktionen mit gezielten JavaScript-Ergänzungen entsteht eine benutzerfreundliche und barriereärmere Navigation.

Der Grundgedanke: Barrierefreiheit bedeutet nicht, möglichst viel JavaScript zu schreiben. Vielmehr geht es darum, vorhandene Browserfunktionen sinnvoll zu nutzen und dort gezielt zu ergänzen, wo zusätzliche Bedienbarkeit einen echten Mehrwert schafft.

Hinweis: Dieses Lernprojekt berücksichtigt ausgewählte Aspekte der digitalen Barrierefreiheit. Es stellt keine vollständige oder zertifizierte Barrierefreiheitsprüfung dar.

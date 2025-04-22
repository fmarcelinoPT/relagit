export default {
	onboarding: {
		takeTour: 'Tour starten',
		next: 'Weiter',
		dismiss: 'Schließen',
		version: 'Version {{version}}',
		header: {
			tooltip: 'Füge deine Repositories über den Repository-Drawer hinzu.'
		},
		add: {
			tooltip:
				'Benutze den Dateiauswahl-Dialog, um ein Repository von deinem Gerät hinzuzufügen.',
			button: 'Füge es jetzt deinem Workspace hinzu.'
		},
		history: {
			tooltip: 'Von hier aus kannst du deine Commit-History ansehen.'
		},
		modal: {
			title: 'Nächste Schritte',
			themes: 'Durchsuche Client Themes',
			workflows: 'Durchsuche Workflows',
			clone: 'Auf GitHub ansehen',
			somethingWrong: 'Etwas ist schief gelaufen?',
			issue: 'Erstelle ein Issue'
		}
	},
	settings: {
		title: 'Einstellungen',
		close: 'Einstellungen schließen',
		restart: 'Erfordert Neustart.',
		workflows: {
			title: 'Workflows'
		},
		commits: {
			title: 'Git'
		},
		general: {
			title: 'Allgemein',
			language: {
				label: 'Sprache',
				description: 'Wähle die Sprache aus, die du benutzen möchtest.'
			},
			editor: {
				label: 'Externer Editor',
				description:
					'Wähle den Editor aus, den du benutzen möchtest, um Dateien zu öffnen.',
				code: 'Visual Studio Code',
				subl: 'Sublime Text',
				'code-insiders': 'Visual Studio Code Insiders',
				atom: 'Atom'
			},
			commitStyle: {
				label: 'Commit Nachrichten-Stil',
				description:
					'Wähle den Stil der Commit Nachrichten aus, den du benutzen möchtest. Das wirkt sich nur auf das aktuell ausgewählte Repository aus',
				conventional: 'Konventionelle Commits',
				relational: 'Relationale Commits',
				none: 'Kein Stil'
			},
			enforceCommitStyle: {
				label: 'Erzwinge Commit Nachrichten-Stil',
				description:
					'Das wird verhindern, dass du committen kannst, wenn deine Commit Nachricht nicht dem Stil entspricht, der für ein Repository ausgewählt wurde.'
			},
			preferParens: {
				label: 'Runde Klammern bevorzugen',
				description: 'Bevorzuge runde Klammern über eckige Klammern für Commit Nachrichten.'
			}
		},
		appearance: {
			title: 'Aussehen',
			vibrancy: {
				label: 'Vibrancy',
				description: 'Aktiviere "Vibrancy". Das kann sich auf die Leistung auswirken.'
			},
			theme: {
				label: 'Erscheinungsbild',
				description: 'Wähle das Erscheinungsbild aus, das du benutzen möchtest.',
				light: 'Hell',
				dark: 'Dunkel',
				system: 'System',
				systemNote:
					'Das Erscheinungsbild der Anwendung ändert sich je nach OS-Einstellungen.',
				choose: 'Wähle {{theme}} Erscheinungsbild'
			},
			font: {
				label: 'Benutzerdefinierte Schriftart',
				description:
					'Das überschreibt die Standard Code-Schrift. Du kannst jede Schriftart benutzen, die auf deinem System installiert ist.'
			},
			clientThemes: {
				label: 'Client Themes',
				description:
					'Wähle benutzerdefinierte Themes aus, die du im Client benutzen möchtest.'
			}
		}
	},
	error: {
		corruptSettings:
			'Eine oder mehrere deiner Konfigurationsdateien sind beschädigt. Bitte setze sie zurück.',
		fetching: 'Unerwarteter Fehler beim Abrufen des Repository-Status',
		remote: 'Unerwarteter Fehler beim Abrufen des Remote-Status',
		git: 'Unerwarteter Fehler beim Ausführen des git-Befehls'
	},
	ui: {
		filepicker: {
			placeholder: 'Wähle eine Datei aus...',
			folderPlaceholder: 'Wähle einen Ordner aus...',
			label: 'Öffne die Dateiauswahl',
			valid: 'Gültige Auswahl',
			directory: ['Ordner', 'Ordner'],
			notEmpty: '{{type}} ist nicht leer',
			file: ['Datei', 'Dateien'],
			doesNotExist: '{{type}} existiert nicht',
			isNot: '{{type}} ist kein {{expected}}'
		}
	},
	workspace: {
		commit: {
			open: 'Öffne {{hash}}'
		}
	},
	sidebar: {
		commit: {
			label: 'Öffne Commit {{hash}}'
		},
		drawer: {
			title: 'Suche Repositories...',
			contextMenu: {
				addRepository: 'Füge Repository hinzu',
				createRepository: 'Erstelle Repository',
				cloneRepository: 'Klone Repository',
				viewIn: 'Anzeigen in {{name}}',
				remove: 'Entfernen'
			},
			switchTo: 'Wechsel zu {{name}}',
			openSettings: 'Öffne Einstellungen',
			settings: 'Einstellungen'
		},
		footer: {
			description: 'Beschreibung',
			summary: 'Zusammenfassung',
			commit: 'Commit zu {{branch}}',
			add: 'Hinzufügen'
		},
		openDrawer: 'Öffne Repository-Drawer',
		upToDate: 'Du bist auf dem neuesten Stand.',
		noCommits: 'Keine Commits',
		noRepo: 'Kein Repository ausgewählt',
		noRepoHint: 'Wähle eins aus, um zu beginnen.',
		noBranch: 'Kein Branch',
		open: 'Öffne {{name}}',
		contextMenu: {
			stage: 'Änderungen stagen',
			unstage: 'Änderungen unstagen',
			stash: 'Änderungen stashen',
			unstash: 'Änderungen unstashen',
			discard: 'Änderungen verwerfen',
			ignore: 'Zu gitignore hinzufügen',
			ignoreExt: 'Füge alle .{{ext}} Dateien zu gitignore hinzu',
			viewIn: 'Anzeigen in {{name}}',
			openIn: 'Öffne in {{name}}',
			openRemote: 'Öffne Remote',
			copySha: 'Kopiere SHA',
			checkout: 'Checkout Commit',
			revert: 'Revert Commit'
		}
	},
	time: {
		second: ['{{count}} Sekunde', '{{count}} Sekunden'],
		minute: ['{{count}} Minute', '{{count}} Minuten'],
		hour: ['{{count}} Stunde', '{{count}} Stunden'],
		day: ['{{count}} Tag', '{{count}} Tage'],
		month: ['{{count}} Monat', '{{count}} Monate'],
		year: ['{{count}} Jahr', '{{count}} Jahre'],
		ago: 'her',
		now: 'Jetzt'
	},
	codeview: {
		imageview: {
			error: 'Konnte kein Bild zum Anzeigen finden',
			errorHint: 'Das liegt wahrscheinlich daran, dass das Bild zu groß zum Anzeigen ist.'
		},
		noCommit: 'Nichts zu sehen',
		noCommitHint: 'Du musst eine Datei auswählen, um ihre Änderungen zu sehen. (´・｀)',
		binary: 'Binäre Datei',
		binaryHint: 'Sorry, wir können dir keine Änderungen für diese Datei anzeigen.',
		loading: 'Lade...',
		loadingHint: 'Das sollte nicht zu lange dauern.',
		errorHint: 'Etwas ist beim laden der Datei schief gelaufen.',
		noChanges: 'Keine ausstehenden Änderungen!',
		noChangesHint: 'Mach eine Pause! Du hast es dir verdient.',
		noFile: 'Keine Dateien ausgewählt.',
		noFileHint: 'Klicke eine Datei in der Seitenleiste an, um zu beginnen.',
		tooBig: 'Dateien zu mächtig!',
		tooBigHint: 'Diese Datei ist soooo groß, dass wir sie aus Leistungsgründen nicht rendern.'
	},
	git: {
		sync: 'Sync',
		hide: 'Verstecken',
		publish: 'Veröffentlichen',
		publishHint: 'Veröffentliche diesen Branch auf Remote.',
		branches: ['Branch', 'Branches'],
		deleteBranch: 'Branch löschen',
		newBranch: 'Neuer Branch',
		createBranch: 'Erstelle Branch',
		pushChanges: 'Änderungen pushen',
		push: ['{{count}} Änderung pushen', '{{count}} Änderungen pushen'],
		pullChanges: 'Änderungen pullen',
		pull: ['{{count}} Änderung pullen', '{{count}} Änderungen pullen'],
		noChanges: 'Keine Änderungen',
		diverged: 'Bäume haben sich verzweigt',
		divergedHint: 'Änderungen stashen und pullen',
		nothingToSee: 'Hier gibt es nichts zu sehen',
		popStash: 'Pop Stash',
		commits: ['{{count}} commit', '{{count}} commits'],
		stashedChanges: ['{{count}} Änderung stashed', '{{count}} Änderungen stashed']
	},
	modal: {
		closeModal: 'Modal schließen',
		confirm: 'Bestätigen',
		cancel: 'Abbrechen',
		close: 'Schließen',
		repository: {
			cancel: 'Abbrechen',
			add: 'Hinzufügen',
			create: 'Erstellen',
			addRepo: 'Füge Repository hinzu',
			createRepo: 'Erstelle Repository',
			notGit: 'Ordner ist kein Git Repository. Möchtest du eines erstellen?'
		},
		reload: {
			title: 'Client neu laden',
			message:
				'Eine Einstellung wurde geändert, die einen Neustart erfordert. Möchtest du jetzt neu laden?'
		},
		error: {
			reload: 'Neu laden',
			reloadClient: 'Client neu laden'
		},
		clone: {
			title: 'Klone Repository',
			back: 'Zurück',
			clone: 'Klonen',
			search: 'Suche',
			loading: 'Lade...',
			loadingHint: 'Bitte warte, während wir deine Repositories abrufen.',
			error: 'Oops! Etwas ist schief gelaufen.',
			errorHint:
				'Wir haben den Ball fallen gelassen, als wir versuchten, deine Repositories zu sammeln.'
		}
	}
} as const;

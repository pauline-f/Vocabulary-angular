# Vocabulary-angular

This application's goal is to help learning vocabulary in another language. 
First, the user creates a login and chooses his language and the language he wants to learn.
The user can add words in a list. For each word, there is a translation.
When the user adds a word, the translation appears. The user can change the translation if he wants.
The user can display all the words or words from a specific list and play a quizz. 
For the quizz, the program displays a word or the translation or reads text as audio, and the user writes the answer.

Features available: 
- Choose 2 languages when the user creates account (his language and the language he wants to learn)
- Display all the words
- Display the words of a specific list
- Add word in a list or a new list
- Play quizz
- Remove word from a list

SCENARIO
1.  The user creates account and chooses 2 languages
2.  The program displays all the words or words of a specific list
3.  The user adds a word in a list or in a new list:
	-	The user writes a word.
	-	The program gets the translation from a web service and shows it.
	-	The user checks the translation (he can change it if he wants).
	-	The program saves the word and the translation in the list.
4.	The user chooses to start a quizz:
	-	The program displays a word, a translation or reads text as audio.
	-	The user writes the answer.
	-	The program displays if it's a good answer or not.

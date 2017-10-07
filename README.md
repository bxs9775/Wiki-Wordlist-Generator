# Wiki-Wordlist-Generator
The backend code for a Node.js server designed to create a plain-text wordlist when given a URL to a supported wiki. This project is not currently being hosted on a live server.

### URLs
{server url}/

For the html GUI controls.

{server url}/getList

[OR]

{server url}/List

Gets the list for the current URL.

Params:
* api [REQUIRED] - the api to be used to gather the data. Acceptable values are mediawiki and wikia, although wikia is not implemented yet.
* url [OPTIONAL] - the url of the wiki you want to get a list of pages from. If you don't include a url the program will use a default url for the current api. www.mediawiki.org for MediaWiki API and www.wikia.com for the Wikia API
* limit [OPTIONAL] - the number of entries to request from the server to make the final list. If this value is not given the limit defaults to 100.

### Wikis that work/don't work with this code
Note: this list is incomplete.

##### With the MediaWiki API

|  Working Wikis    | Wikis that don't work |
| ----------------- | --------------------- |
| www.mediawiki.org | zelda.gamepedia.com   |
| www.jedipedia.net | www.gamepedia.com     |
| en.wikipedia.org  | www.wikia.com         |

##### With the Wikia API

|  Working Wikis    | Wikis that don't work |
| ----------------- | --------------------- |
| www.wikia.com |    |
| terraria.wikia.com | |

# githabit
githabit is a github styled habit tracker website that anyone can host by utilizing github pages and google spread sheet.

![image](https://user-images.githubusercontent.com/97814789/187536466-84ed0391-4ae8-4fac-8aad-6bc2a9f63ad8.png)

## Concept
- Keep following a single habit. Not multiple, human can't handle it.
- Just Yay/Nay. "How much" does not matter, doing matters. 
- Feel the grass

## How it works
![image](https://user-images.githubusercontent.com/97814789/187274225-d46fd408-c731-4e18-b8fe-cfa23a66f862.png)

## Setup
### 1. Fork this repo
- keep it public
- keep repo name githabit (If you want to change, don't forget to modify ./frontend/package.json's "homepage" to your repo's name)

### 2. Setup google spreadsheet
- just go to https://docs.google.com/spreadsheets to create one, name it whatever you like.  
- Fill in habit title and password to cell A1 and A2  
![image](https://user-images.githubusercontent.com/97814789/187562782-e95d6f69-0b1a-4a2b-b226-2ef9dbe0a5cb.png)  
do not modify any other cell

### 3. Setup Google Apps Script
- Click "Apps Script"  
![image](https://user-images.githubusercontent.com/97814789/187563099-3fbad964-b74d-4f8f-9bfc-8d6a3b887b10.png)
- paste [code](https://github.com/0xsuk/githabit/blob/main/backend/Code.gs.js) to editor (you can remove myFunction)
- **replacechange SPREADSHEET_URL constant to your spreadsheet url**
- Deploy web app. Click "New Deployment". 
![Screenshot from 2022-08-31 08-51-16](https://user-images.githubusercontent.com/97814789/187563861-6bb9f1f1-48a0-45f9-a32c-62822ffdf37a.png)
- Select type "web app", set Executed as "Me", set Who has access "Anyone". Then Deploy.
![image](https://user-images.githubusercontent.com/97814789/187563825-f06d63ff-a245-464c-bc39-3becb8c68509.png)
- Copy Web App URL  
![image](https://user-images.githubusercontent.com/97814789/187564133-209404c7-fdac-4220-bd0e-a31073c40837.png)

### 4. Replace [GASAPI](https://github.com/0xsuk/githabit/blob/main/frontend/src/constants.js) with your web app url

### 5. Fire Github Workflow
- Go to Actions tab in your forked repo, and run workflow manually to deploy githabit to Github Pages
![Screenshot from 2022-08-31 08-39-41](https://user-images.githubusercontent.com/97814789/187564602-2fd68f3a-6eaa-41d3-85ff-78ae004f6a42.png)
and run workflow manually
- Wait until deployment finishes. Once deployed, gh-pages branch should be created.

### 6. Enable Github Pages
- In your repo, go to settings => Pages. Set branch to gh-pages, then save.  
![Screenshot from 2022-08-31 08-41-17](https://user-images.githubusercontent.com/97814789/187564901-65addd49-edc2-4274-ac55-5b73cf190d47.png)
- Wait until pages setup. 

You should now be able to see Login screen at https://${username}.github.io/githabit

## Usage
- Type password you set in the spreadsheet in order to login. 
- Click Yay to mark habit as done
- Click Nay to unmark habit
- Keep going

technical details
- Cell A3 is used as session ID storage.
- Unfortunately, Google Apps Script cannot get http request headers, meaning githabit frontend can't send session ID as cookie in request headers. Hence githabit sends session ID in post body data. 
- session ID is supposed to stored in localStorage not in cookie storage, and it never expires. Not the best practice, but this is because githabit is not security focused. 

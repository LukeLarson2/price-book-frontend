# price-book
Enter and store items by state and zip to capture item price, sales tax, and total price.<br>The total price can then be used by a shopping cart to display price inclusive of sales tax.

<b>Create a form with the following labels and attributes:</b><br>Item : text up to 10 characters<br>State : text up to 2 characters<br>Zip : number requiring 5 digits including leading 0<br>Item Price : round number

<b>Create a list page with the following attributes and controls</b><br>
Item | State | Zip | Item Price | Sales Tax | Total Price | Update Delete



1. Form - On Posting the Form…Calculate the Sales Tax and add the Item Price + Sales Tax to Total Price, store all info in DB
2. List Form - with the ability to Update Entry or Delete Entry
3. Call to AvaTax https://pypi.org/project/Avalara/ to install SDK


Authorized users will be able to view, add, update and delete each entry in the price book

<b>Style</b><br>
1. Entry form for adding and updating
2. List form for viewing all the entries

<b>Content</b><br>
1. Validate the State is two characters
2. Validate the item price is a numeric
3. pass the current date, amount, zip, state to AvaTax 



<b>Related</b><br>
To calculate sales tax, make a call to AvaTax by implementing this code snippet  

import client from 'AvaTaxClient'

#Create a new AvaTaxClient object 
client = AvaTaxClient('my test app',    ‘ver 0.0',    'my test machine',    'production')

#Add your credentials
client = client.add_credentials('USERNAME/ACCOUNT_ID', 'PASSWORD/LICENSE_KEY')

#Build your tax document
tax_document = {    'addresses': {        'SingleLocation': {            'city': 'Irvine',            'country': 'US',            'line1': '2000 Main Street',            'postalCode': '{Variable}’,            'region': '{CA}'        }    },              'customerCode': 'GUEST',    'date': '{2017-04-12}',    'lines': [        {            'amount': '{40}',  'number': '1',  'taxCode': 'P0000000'        }    ],    'type': 'SalesOrder'}

#Create transaction
transaction_response = client.create_transaction(tax_document)

#Parse the totalTax attribute value from transaction_response object and save this value for each item entry.  Use this value to calculate “total price” and also save with each item entry

UPDATE expenses 
SET tooltip = json '[{ "text": "According to the Ordre des médecins vétérinaires du Québec (OMVQ), a vaccination must be preceded by a complete physical examination by the veterinarian.", "link": "https://www.cvetc.com/en-ca/resources/vaccination-guide-for-cats" }]'
WHERE name = 'Vaccines (excluding health check-up)';

UPDATE expenses 
SET tooltip = json '[{ "text": "A good option is to have it done at the same time as a routine anaesthesia (e.g.: sterilization).", "link": "https://www.vetetnous.com/en/tips/demystifying-the-microchip-cat/" }, { "text": "Microchipping is now mandatory for cats and dogs in many Quebec municipalities and cities, including Montreal and Laval.", "link": "https://www.mondou.com/en-CA/blogs/advice/dog/microchip-everything-you-need-to-know-ad44.html"}]'
WHERE name = 'Microchip implantation (implant not included)';
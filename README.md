# Diploma Supplement Portal




## English Version

This project was developed with funding form "Transformation of Greek e-Gov Services to eIDAS Crossborder Services", Agreement number: INEA/CEF/ICT/A2015/1147836 | Action No: 2015-EL-IA-0083, by the "Information Management Lab (i4M Lab)", which is part of the research group  "ATLANTIS Group".

- Information about "ATLANTIS Group" can be found: http://www.atlantis-group.gr/
<!-- - Για νέα σχετικά με την εξέλιξη του έργου επισκεφθείτε την ιστοσελίδα: https://ma.ellak.gr/forge/projects/jobselection_iap -->
<!-- /- Για την χρήση της εφαρμογής επισκεφθείτε την ιστοσελίδα: http://iap.atlantis-group.gr/TestJobSelection/home.php -->


### Project Scope

The scope of this project is the creation of a secure infrastructure for the publication of "Diploma Supplements" of the alumni of the university of the Aegean, while at the same time provide an expandable infrastructure to incorporate future universities. The user authentication is made using the eIDAS infrastructure(https://ec.europa.eu/digital-single-market/en/policies/trust-services-and-eidentification).
After a user is authenticated they can access the service and request the publication of their academic records (Diploma Supplements). Next, they can grant access to them to third parties in the form of email of QR invites. These invites are uniquely "locked" to each recipient and cannot be forwarded to aunothorized parties.

To ensure the integrity and authenticity of the records, as well as to protect the privacy of the alumni, instead of storing the Diploma Supplements in a traditional database, they are stored in a private blockchain specifically created for the proposes of the project. This blockchain is created using the opensource software of HyperLedger Fabric (https://www.hyperledger.org/).


### Repository Contents [deliverables]

This repository is seperated in the following parts:

* **dsIss**, contains a mircoservice which acts as a trust anchor to the system. This microservice interacts with the Greek eIDAS node to authenticate the users. Implementation Java/Spring boot (https://projects.spring.io/spring-boot/)
* **studentApp**, contains a microservice  that provides the UI of the users abd handles the interaction with the blockchain. Additionally, this service interacts with the ldsIss microservice through a REST api. Implementation  nodejs/Express (https://expressjs.com/)
* **univApp**, contains a microservice that monitors the blockchain and acts on behalf of the University of the Aegean. Implementation nodejs/Express (https://expressjs.com/)
* **univBackEnd**, contains a microservice that provides the connection to the database of the Univseristy of the Aegean. It interacts with the  univApp using gRPC (https://grpc.io/). Implementation nodejs/Express (https://expressjs.com/)
* **hlfNetwork**, contains all the necessary configuration and deployment files for the creation of the blockchain. Deployment of the contained services requires  docker (https://www.docker.com/), docker-compose(https://docs.docker.com/compose/) and docker-swarm(https://docs.docker.com/engine/swarm/).



### ReadMe.docx

Contains material relative to the development of the project.  It helps get a better understanding of the project and its code (https://docs.google.com/document/d/1o36_Y5FO6vM2Ij6t93JdUmBjioH1dGf4li-Po1XK3Sg/edit?usp=sharing).


### Source Code

Contains the code used for the deployment of the service.
<!-- - https://github.com/ellak-monades-aristeias/jobselection_iap -->

## Greek Version

Το έργο αναπτύχθηκε για τις ανάγκες του έργου  "Transformation of Greek e-Gov Services to eIDAS Crossborder Services", Agreement number: INEA/CEF/ICT/A2015/1147836 | Action No: 2015-EL-IA-0083, από το "Information Management Lab (i4M Lab)", το οποίο αποτελεί μέρος της Ερευνητικής Ομάδας "ATLANTIS Group".

- Σχετικά με την Ερευνητική Ομάδα "ATLANTIS Group" επισκεφθείτε την ιστοσελίδα: http://www.atlantis-group.gr/
<!-- - Για νέα σχετικά με την εξέλιξη του έργου επισκεφθείτε την ιστοσελίδα: https://ma.ellak.gr/forge/projects/jobselection_iap -->
<!-- /- Για την χρήση της εφαρμογής επισκεφθείτε την ιστοσελίδα: http://iap.atlantis-group.gr/TestJobSelection/home.php -->


### Σκοπός του έργου

Σκοπός του έργου είναι η δημιουργία κατάλληλης υποδομής για την ασφαλή δημοσίευση "Αντιγράφων Διπλώματος" ("Diploma Supplements") των φοιτητών του πανεπιστημίου Αιγαίου, ενώ πράλληλα να προσφέρει ένα εύκολο τρόπο εισαγωγής νέων πανεπιστημίων. Η ταυτοποίηση και σύνδεση των φοιτητών στο σύστημα γίνεται μέσω της υποδομής του eIDAS (https://ec.europa.eu/digital-single-market/en/policies/trust-services-and-eidentification). Αφού ταυτοποιηθεί ο χρήστης μπορεί να ζητήσει τη δημοσιοποίηση των Αντιγράφων Διπλώματος του στο σύστημα. Σε αυτό το στάδιο μόνο ο χρήστης μπορεί να προσπελάσει τα Αντίγραφα Διπλωμάτων του. Στη συνέχεια μπορεί παραχωρήσει πρόσβαση σε αυτά με τη μορφή προσκλήσεων είτε μέσω email είτε μέσω QR codes, χρησιμοποιώντας σαν αναγνωριστικό το email του παραλλήπτη. Οι προσκλήσεις αυτές "κλειδώνοται"από τον παραλήπτη και δεν είναι δυνατό να διαμοιραστούν σε τρίτους.


Για τη διασφάληση της ορθότητας των στοιχείων, την προστασία τους από την παραποίηση καθώς και για τη διασφάληση και προστασία του απορρήτου τους,  αντί να αποθηκεύονται τα "Αντίγραφα Διπλώματος" σε μια απλή βάση δεδομέων, αποθηκεύονται σε ένα κατάλληλα διαμορφομένο blockchain στο οποίο συμμετέχουν όλα τα πανεπιστήμια του συστήματος. Το blockchain αυτό είναι υλοποιημένο χρησιμοποιώντας το ανοικό λογισμικό του HyperLedger Fabric (https://www.hyperledger.org/).


### Περιεχόμενα του αποθετηρίου [Παραδοτέων]

Το αποθετήριο είναι χωρισμένο στα εξής μέρη:

* **dsIss**, περιέχει ένα mircoservice το οποίο δρα σαν trust anchor στο σύστημα, και αλληλεπιδρά με τον eIDAS κόμβο της Ελλάδας για να ταυτοποιήσει τους χρήστες (υλοποίηση Java/Spring boot, https://projects.spring.io/spring-boot/)
* **studentApp**, περιέχει ένα  microservice  το οποίο παρέχει το UI των χρηστών και χειρίζεται την αλληλεπίδρασή τους με το blockchain. Αλληλεπιδρά με το με το loginWebApp microservice μέσω REST api. Υλοπoίηση με nodejs/Express (https://expressjs.com/)
* **univApp**, περιέχει ένα microservice το οποίο παρακολουθεί το blokchain και δρα εκ μέρους του πανεπιστημίου του Αιγαίου. Υλοπoίηση με nodejs/Express (https://expressjs.com/)
* **univBackEnd**, περιέχει ένα microservice οποίο παρέχει τη σύνδεση με τη βάση δεδομένων του πανεπιστημίου του Αιγαίου. Αλληλεπιδρά με το univApp μέσω gRPC (https://grpc.io/). Υλοπoίηση με nodejs/Express (https://expressjs.com/)
* **hlfNetwork**, περιέχει τα αναγκαία αρχεία ρυθμίσεων για τη δημιουργία του blockchain. Έιναι αναγκαία η χρήση docker (https://www.docker.com/), docker-compose(https://docs.docker.com/compose/) και docker-swarm(https://docs.docker.com/engine/swarm/).



### ReadMe.docx

Περιλαμβάνει υλικό σχετικό με την ανάπτυξη του έργου, ιδιαίτερα χρήσιμο για την κατανόηση των αρχείων κώδικα. Σχετικά με τη λήψη του αρχείου αυτού επισκεφθείτε την ιστοσελίδα:
(https://docs.google.com/document/d/1o36_Y5FO6vM2Ij6t93JdUmBjioH1dGf4li-Po1XK3Sg/edit?usp=sharing)
<!-- https://github.com/ellak-monades-aristeias/jobselection_iap/blob/master/ReadMe.docx -->

### Αρχεία κώδικα

Περιλαμβάνει τα αρχεία κώδικα που χρησιμοποιήθηκαν για την ανάπτυξη της εφαρμογής "Job Selection - IAP".
<!-- - https://github.com/ellak-monades-aristeias/jobselection_iap -->

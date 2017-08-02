/*
Copyright IBM Corp. 2016 All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package main

import (
	"fmt"
	"encoding/json"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"crypto/rand"

)
// "strings"


// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}
//Diploma Suplement Structure
type DiplomaSupplement struct {
	Owner string
	Name string
	Surname string
	University string
	Authorized []AuthorizedUser
	Id string
	Signature string
}



type SupplementsAsset struct{
	Supplements []DiplomaSupplement
}

type EmployersAsset struct{
	Employers []string
}

type UniversitiesAsset struct{
	Universities []string
}

type DiplomaSupplementMapsAsset struct{
	DiplomaSupplementMaps map[string]DiplomaSupplementMap
}


type DiplomaSupplementMap struct {
	DSHash string
	DSId string
	Email string
	Code string
	Recipient string
}

// Structure that holds all the assets of the app
type Assets struct{
	Supplements []DiplomaSupplement
	Employers []string
	Universities []string
	DiplomaSupplementMap map[string]DiplomaSupplementMap
	PublishRequests []PublishRequest
}

type AuthorizedUser struct{
	Email string
	Eid   string
}

type PublishRequest struct{  //name,eid,uniId,email,userEid
	Name  string
	Eid string
	Email string
	UniId string
	EidHash string
	University string
}

type PubRequestsAsset struct{
	Requests []PublishRequest
}


type CustomEvent struct{
	Message string
	Body   PublishRequest
	TxId   string
}



func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}


func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response  {

	// _, args := stub.GetFunctionAndParameters()

	// "list", slice in golang, that will hold the DiplomaSupplements as strings
	var supplements = make([]DiplomaSupplement,0)
	// slice, that will hold the eIDs of the employers as strings
	var employers = make([]string,0)
	// slice, that will hold the eIDs of the universities as strings
	var universities = make([]string,0)
	// slice, that will hold the publication Requests of the users
	var pubRequests = make([]PublishRequest,0)
	//map that will hold the diplomasupplmet-hash-recipient map
	var diplomaSupplementMaps = make(map[string]DiplomaSupplementMap)


	assets := Assets{ Universities: universities,
		Employers:employers, Supplements:supplements,
		DiplomaSupplementMap:diplomaSupplementMaps,
		PublishRequests : pubRequests	}
	encodedAssets,err  := json.Marshal(assets)
	err = stub.PutState("assets", []byte(encodedAssets))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}


func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {

	function, args := stub.GetFunctionAndParameters()

	if function == "publish"{
		return t.publish(stub, args)
	}

	if function == "addAuthorizedUser"{
		return t.addAuthorizedUser(stub, args)
	}

	if function == "addDiplomaSupplementMap"{
		return t.addDiplomaSupplementMap(stub,args)
	}

	if function == "addRecepientToDSMap"{
		return t.addRecepientToDSMap(stub,args)
	}

	if function == "genCodeForDSMap"{
		return t.genCodeForDSMap(stub,args)
	}

	if function == "uninvite"{
		return t.uninviteUsers(stub,args)
	}

	if function == "requestSupplementPublication"{
		return t.requestSupplementPublication(stub,args)
	}

	//queries
	if function == "getSupplements" {
		return t.getSupplements(stub, args)
	}

	if function == "getSupplementById"{
		return t.getSupplementById(stub,args)
	}

	if function == "getDiplomaSupplementMapsByHash" {
		return t.getDiplomaSupplementMapsByHash(stub,args)
	}

	if function == "getPendingRequestByUniv" {
		return t.getPendingRequestByUniv(stub,args)
	}

	return shim.Error(fmt.Sprintf("Unknown action. Got: %v", args[0]))
}

// ************************** QUERIES ***************************************************

	/**
		Get all supplements that belong to a user submitting  the query
	 	If the user is a University all the supplements of teh University will be returned
		else, the supplements that denote him as the owner will only be returned
	**/
	func (t *SimpleChaincode) getSupplements(stub shim.ChaincodeStubInterface, args []string) pb.Response {

		if len(args) != 1 {
			return shim.Error("Expectiong one argument! The userId")
		}

		userEid := args[0]

		//get all supplements from the state
		assetBytes, err := stub.GetState("assets")
		if err != nil {
			return shim.Error("{\"Error\":\"Failed to get state for key \"assets\"}")
		}
		res := Assets{}
		json.Unmarshal([]byte(assetBytes), &res)

		supps:= SupplementsAsset{Supplements:res.Supplements}
		matchingSupplements := make([]DiplomaSupplement,0)

		// v1.0 has not ABAC so we have to resolve to Identity based acecss control
  	// invokerId,_ := stub.GetCreator() // this  returns the cerificate of the invoker
																				// NOT usefull i think
																				//TODO maybe add this as an extra security meassure

		for _,element := range supps.Supplements {
			// element is the element from someSlice for where we are
			if element.University == userEid  || element.Owner == userEid {
				matchingSupplements = append(matchingSupplements,element)
			}
		}
		encodedSupps,_ := json.Marshal(matchingSupplements)
		return shim.Success([]byte(encodedSupps))
	}




	/**
			Get all the DiplomaSupplementMaps using its key (i.e. DS hash)
	**/
	func (t *SimpleChaincode) getDiplomaSupplementMapsByHash(stub shim.ChaincodeStubInterface, args []string) pb.Response {

		if len(args) != 1 {
			return shim.Error("Incorrect number of arguments. Expecting the hash of the diplomaSupplement")
		}
		dsHash := args[0]
		assetBytes, err := stub.GetState("assets")
		if err != nil {
			return shim.Error("{\"Error\":\"Failed to get state for key \"assets\"}")
		}
		res := Assets{}
		json.Unmarshal([]byte(assetBytes), &res)

		diplomaSupplementMaps:=res.DiplomaSupplementMap
		result,ok := diplomaSupplementMaps[dsHash]
		if ok {
			encodedRes,_ := json.Marshal(result)
			return shim.Success([]byte(encodedRes))
			}else{
				return shim.Error("Could not find the requested ds has")
			}
		}


		/**
		Get the supplement by the given id, if the user
		belongs to the Authorized Users for the supplemnt, or the user
		is the owner of the supplement
		**/
		func (t *SimpleChaincode) getSupplementById(stub shim.ChaincodeStubInterface, args []string) pb.Response {

			if len(args) != 2 {
				return shim.Error("Incorrect number of arguments. Expecting the SupplementId and UserEid to query")
			}
			suplementId := args[0]
			userEid := args[1]

			assetBytes, err := stub.GetState("assets")
			if err != nil {
				return shim.Error("{\"Error\":\"Failed to get state for key \"assets\"}")
			}
			assets := Assets{}
			json.Unmarshal([]byte(assetBytes), &assets)

			supplement, position := findSupplementInSlice(assets.Supplements, suplementId)
			if position == -1{
				return shim.Error("No Supplement Found with the given ID")
			}

			authorizedUsers   := supplement.Authorized
			isAllowed := false

			// v1.0 has not ABAC so we have to resolve to Identity based acecss control
			// eid, err := stub.GetCreator()
			// eidString := string(eid)

			if userEid == supplement.Owner{
				isAllowed = true
				}	else{
					for _,element := range authorizedUsers {
						// element is the element from someSlice for where we are
						if userEid == element.Eid {
							isAllowed = true
						}
					}
				}

				if isAllowed{
					encodedResult,err  := json.Marshal(supplement)
					if err != nil {
						return shim.Error("error marshalling supplement")
					}
					return shim.Success([]byte(encodedResult))
					}else{
						return shim.Error("User not Authorized to see this supplement")
					}
				}


	/**
			Get all the pendingn supplment request that are submitted to the
			user eid invoking the transaction.
	**/
	func (t *SimpleChaincode) getPendingRequestByUniv(stub shim.ChaincodeStubInterface, args []string) pb.Response{
		if len(args) != 1 {
			return shim.Error("Incorrect number of arguments. Expecting 1, the userEid")
		}
		userEid := args[0]
		// eid, err := stub.GetCreator()
		// universityEid := string(eid)

		assetBytes, err := stub.GetState("assets")
		if err != nil {
			return shim.Error("{\"Error\":\"Failed to get state for key \"assets\"}")
		}
		assets := Assets{}
		json.Unmarshal([]byte(assetBytes), &assets)

		matchingPendingRequests := make([]PublishRequest,0)
		pendingReq := assets.PublishRequests
		//fill the matching Requests
		for _,request := range pendingReq {
			if request.UniId == userEid {
				matchingPendingRequests = append(matchingPendingRequests,request)
			}
		}
		encodedRes,_ := json.Marshal(matchingPendingRequests)
		return shim.Success([]byte(encodedRes))
}





// --------------------------INVOKE TRANSACTIONS -----------------------------------------------------


//Adds a request by a user to the university to publish his DS
func (t *SimpleChaincode) requestSupplementPublication(stub shim.ChaincodeStubInterface, args []string)  pb.Response {
		if len(args) != 7 {
			return sendErrorEvent(stub,"Incorrect number of arguments. Expecting 7, the first is the userEid")
		}

		userEid := args[0]
		//name,eid,uniId,email,userEid,university
		name := args[1]
		eid := args[2]
		uniId := args[3]
		email  := args[4]
		eidHash := args[5]
		university := args[6]

		//get the assets from the state
		assetBytes, err := stub.GetState("assets")
		if err != nil {
			return sendErrorEvent(stub,"Failed to get state for key \"assets\"")
		}
		//get the supplements from the assets
		assets := Assets{}
		json.Unmarshal([]byte(assetBytes), &assets)
		pubRequestsSlice := assets.PublishRequests


		isIssuedBySender  :=	( userEid == eid)
		if isIssuedBySender {
			request := PublishRequest{
				Name  : name,
				Eid : eid,
				Email : email,
				UniId : uniId,
				EidHash : eidHash,
				University : university }
			pubRequestsSlice = append(pubRequestsSlice,request)
			assets.PublishRequests = pubRequestsSlice

			//update the state with the new assets
			encodedAssets,err  := json.Marshal(assets)
			if err != nil {
				return sendErrorEvent(stub,"Could not Marshal Assets")
			}
			err = stub.PutState("assets", []byte(encodedAssets))
			if err != nil {
				sendErrorEvent(stub,"Could not put assets to state")
			}
			//Execution of chaincode finishe successfully
			sendSuccessEvent(stub,request,"Tx chaincode finished OK.")
		}else{
			sendErrorEvent(stub,"Could not put assets to state")
		}

		return shim.Success(nil)
	}


/*
  Puts a new DiplomaSupplement to the state
  args[0] the DiplomaSupplement JSON string

	Requires that there exist a PubRequest with
	(request.EidHash == suplement.Owner) &&
 	(request.University == suplement.University)
*/
func (t *SimpleChaincode) publish(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
	return sendErrorEvent(stub,  "Incorrect number of arguments. Expecting 2. The DS JSON and UserEid"  )
	}
	//encode into a DiplomaSupplement strct the argument
	suplementString := args[0]
	userEid := args[1]
	suplement := DiplomaSupplement{}
	json.Unmarshal([]byte(suplementString), &suplement)


	// invokerId, _ := stub.GetCreator()
	isIssuedBySender  :=	( userEid == suplement.University)

	if isIssuedBySender{
			//get the assets from the state
			assetBytes, err := stub.GetState("assets")
			if err != nil {
				return sendErrorEvent(stub,"{\"Error\":\"Failed to get state for key \"assets\"}" )
			}
			assets := Assets{}
			json.Unmarshal([]byte(assetBytes), &assets)

			found := false
			index := -1
			pubRequestsSlice := assets.PublishRequests
			for indx, request := range pubRequestsSlice{
				if (request.EidHash == suplement.Owner) &&
				(request.University == suplement.University){
					found = true
					index = indx
					break
				}
			}
			if found {
				//apend the received supplement to the assets
				supplementSlice := assets.Supplements
				supplementSlice = append(supplementSlice,suplement)
				assets.Supplements = supplementSlice

				//remove the request from the pending requests
				pubRequestsSlice= removeFromReqSlice(pubRequestsSlice,index)
				assets.PublishRequests = pubRequestsSlice

				//update the state with the new assets
				encodedAssets,err  := json.Marshal(assets)
				if err != nil {
					return sendErrorEvent(stub, "Could not  marshal assets")
				}
				err = stub.PutState("assets", []byte(encodedAssets))
				if err != nil {
					return sendErrorEvent(stub,"Could not place assets back in the state" )
				}
				//Execution of chaincode finished successfully
				return sendSuccessEvent(stub,PublishRequest{},"Tx chaincode finished OK.")

			}else{
				return sendErrorEvent(stub,"No Publication Request Found for" + suplement.Owner + " \n " + suplement.University)
			}
		}else{
			return sendErrorEvent(stub," Identities not match, expecting " + suplement.University + " found " + userEid )
		}
		return shim.Success(nil)
}



		// Puts a new DSMAp to the state
		// args[0] the DSMAP  JSON string
		// Only a user that has the attribute typeOfUser = Student can invoke this transaction with success
		// and he has to be the owner of the supplment as that is identified by the DSId filed of the DSMAP struct
		func (t *SimpleChaincode) addDiplomaSupplementMap(stub shim.ChaincodeStubInterface, args []string)  pb.Response {
			// if len(args) != 1 {
			// 	return sendErrorEvent(stub,"Incorrect number of arguments. Expecting 1")
			// }
			//
			// //encode into a DiplomaSupplementMap from strct the argument
			// dsmapString := args[0]
			// dsmap := DiplomaSupplementMap{}
			// json.Unmarshal([]byte(dsmapString), &dsmap)
			//
			// // Here the ABAC API is called to verify the attributes, only then will the new
			// // supplement be added
			// isUniversity, _ := stub.VerifyAttribute("typeOfUser", []byte("Student"))
			// suplementId := dsmap.DSId
			//
			//
			// assetBytes, err := stub.GetState("assets")
			// if err != nil {
			// 	return sendErrorEvent(stub, "Error, Failed to get state for key \"assets\"" )
			// }
			// assets := Assets{}
			// json.Unmarshal([]byte(assetBytes), &assets)
			//
			// supplement, position := findSupplementInSlice(assets.Supplements, suplementId)
			// if position == -1{
			// 	return sendErrorEvent(stub, "Error, No Supplement Found with the given ID" + suplementId)
			// }
			//
			// //check if the supplement is issued by the user sending the transaction
			// isIssuedBySender, _ := stub.VerifyAttribute("eID", []byte(supplement.Owner))
			//
			// if isUniversity && isIssuedBySender{
			// 	//apend the received DiplomaSupplementMap to the assets
			// 	assets.DiplomaSupplementMap[dsmap.DSHash] = dsmap
			//
			// 	//update the state with the new assets
			// 	encodedAssets,err  := json.Marshal(assets)
			// 	if err != nil {
			// 		return sendErrorEvent(stub, "Error, Marshaling Assets" )
			// 	}
			// 	err = stub.PutState("assets", []byte(encodedAssets))
			// 	if err != nil {
			// 		return sendErrorEvent(stub,  "Error,putting assets back in state" )
			// 	}
			// 	//Execution of chaincode finishe successfully
			// 	return sendSuccessEvent(stub,PublishRequest{},"Tx chaincode finished OK.")
			// }
			return shim.Success(nil)
		}



		/*
		Adds the given recepientEid (args[1]) as the the Recepient of the DiplomaSupplementMap
		which is identified by the give DSHash (args[0]) and updates the authorized users of
		the actual diplpoma supplement
		*/
		func (t *SimpleChaincode) addRecepientToDSMap(stub shim.ChaincodeStubInterface, args []string) pb.Response {
			// if len(args) != 3 {
			// 	return sendErrorEvent(stub,"Wrong number of arguments, Expecting 3")
			// }
			//
			// //encode into a DiplomaSupplementMap from strct the argument
			// dsHash := args[0]
			// recepientEid := args[1]
			// emailedCode := args[2]
			//
			// //get the assets from the state
			// assetBytes, err := stub.GetState("assets")
			// if err != nil {
			// 	return sendErrorEvent(stub,  "{\"Error\":\"Failed to get state for key \"assets\"}")
			// }
			// assets := Assets{}
			// json.Unmarshal([]byte(assetBytes), &assets)
			//
			//
			// //find the DSMap in the state
			// dsMap,ok:= assets.DiplomaSupplementMap[dsHash]
			// if ok {
			// 	if dsMap.Recipient != "" {
			// 		return sendErrorEvent(stub, "Error, DiplomaSupplementMap is already finalized! Cannot add new Recipient!")
			// 		}else{
			// 			if dsMap.Code != emailedCode {
			// 				return sendErrorEvent(stub,  "Error, Wrong Authorization code!")
			// 				}else{
			// 					dsMap.Recipient = recepientEid
			// 					//update the assets and put them in the state
			// 					//update the DSMap
			// 					assets.DiplomaSupplementMap[dsHash] = dsMap
			//
			// 					//update the actual supplement
			// 					supplementSlice := assets.Supplements
			// 					suplementId := dsMap.DSId
			// 					supToUpdate , position := findSupplementInSlice(supplementSlice, suplementId)
			// 					if position == -1 {
			// 						return sendErrorEvent(stub,"Error, No supplement found for the given ID" +suplementId)
			// 					}
			// 					authorizedUserEntry  := AuthorizedUser{Email:dsMap.Email, Eid: recepientEid}
			// 					supToUpdate.Authorized = append(supToUpdate.Authorized,authorizedUserEntry)
			// 					//delete the old version of the supplement
			// 					supplementSlice = removeFromSupSlice(supplementSlice,position)
			// 					//add the new supplement
			// 					supplementSlice = append(supplementSlice,supToUpdate)
			// 					assets.Supplements = supplementSlice
			//
			//
			// 					encodedAssets,err  := json.Marshal(assets)
			// 					if err != nil {
			// 						return sendErrorEvent(stub,"Error, Marshaling assets")
			// 					}
			// 					err = stub.PutState("assets", []byte(encodedAssets))
			// 					if err != nil {
			// 						return sendErrorEvent(stub,"Error, putting assets")
			// 					}
			// 					//Execution of chaincode finishe successfully
			// 					sendSuccessEvent(stub,PublishRequest{},"Tx chaincode finished OK.")
			// 				}
			// 			}
			// 			}else{
			// 				return sendErrorEvent(stub, "Error, No DiplomaSupplementMap Found with the given hash " + dsHash)
			// 			}
						return  shim.Success(nil)
					}


/*
generates a random string and adds it at the field of the DSMap
*/
func (t *SimpleChaincode) genCodeForDSMap(stub shim.ChaincodeStubInterface, args []string) pb.Response {
		// if len(args) != 2 {
		// return sendErrorEvent(stub,"Incorrect number of arguments. Expecting 1")
		// }
		// dsHash := args[0]
		// emailCode := args[1]
		// //get the assets from the state
		// assetBytes, err := stub.GetState("assets")
		// if err != nil {
		// return sendErrorEvent(stub,"{\"Error\":\"Failed to get state for key \"assets\"}")
		// }
		// assets := Assets{}
		// json.Unmarshal([]byte(assetBytes), &assets)
		//
		// //find the DSMap in the state
		// dsMap,ok:= assets.DiplomaSupplementMap[dsHash]
		// if ok {
		// if dsMap.Recipient != "" {
		// return sendErrorEvent(stub,"Error, DiplomaSupplementMap is already finalized! Cannot add new Recipient!")
		// }else{
		// dsMap.Code = emailCode
		// //update the assets and put them in the state
		// //update the DSMap
		// assets.DiplomaSupplementMap[dsHash] = dsMap
		//
		// encodedAssets,err  := json.Marshal(assets)
		// if err != nil {
		// 	return nil, err
		// }
		// err = stub.PutState("assets", []byte(encodedAssets))
		// if err != nil {
		// 	return sendErrorEvent(stub,"Error,putting assets in state")
		// }
		// //Execution of chaincode finishe successfully
		// sendSuccessEvent(stub,PublishRequest{},"Tx chaincode finished OK.")
		// }
		// }else{
		// return sendErrorEvent(stub,"Error, No DiplomaSupplementMap Found with the given hash " + dsHash )
		// }
return shim.Success(nil)
}


// Updates a DiplomaSupplement, passed by its id, (args[0]) such that
// it can be viewed by the user args[1]
func (t *SimpleChaincode) addAuthorizedUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {
			// if len(args) != 3 {
			// return sendErrorEvent(stub,"Incorrect number of arguments. Expecting 2")
			// }
			// //the DiplomaSupplement id
			// suplementId := args[0]
			// //the user that should be allowed to view the supplement
			// newUser := args[1]
			// email := args[2]
			//
			// //get the assets from the state
			// assetBytes, err := stub.GetState("assets")
			// if err != nil {
			// return sendErrorEvent(stub,"{\"Error\":\"Failed to get state for key \"assets\"}")
			// }
			// //get the supplements from the assets
			// assets := Assets{}
			// json.Unmarshal([]byte(assetBytes), &assets)
			// supplementSlice := assets.Supplements
			//
			// supToUpdate , position := findSupplementInSlice(supplementSlice, suplementId)
			// if position == -1 {
			// return sendErrorEvent(stub,"No supplement found with the given ID " + suplementId)
			// }
			//
			//
			// // Here the ABAC API is called to verify the attributes, only then will the
			// // supplement be updated
			// isStudent, _ := stub.VerifyAttribute("typeOfUser", []byte("Student"))
			// isOwner, _ := stub.VerifyAttribute("eID", []byte(supToUpdate.Owner))
			//
			// if isStudent && isOwner{
			//
			// authorizedUserEntry := AuthorizedUser{Email: email, Eid : newUser }
			// supToUpdate.Authorized = append(supToUpdate.Authorized,authorizedUserEntry)
			//
			// //delete the old version of the supplement
			// supplementSlice = removeFromSupSlice(supplementSlice,position)
			// //add the new supplement
			// supplementSlice = append(supplementSlice,supToUpdate)
			//
			// assets.Supplements = supplementSlice
			//
			// //update the state with the new assets
			// encodedAssets,err  := json.Marshal(assets)
			// if err != nil {
			// 	return sendErrorEvent(stub,"Error Marshaling Assets")
			// }
			// err = stub.PutState("assets", []byte(encodedAssets))
			// if err != nil {
			// 	return sendErrorEvent(stub,"Error putting assets in state")
			// }
			// //Execution of chaincode finishe successfully
			// sendSuccessEvent(stub,PublishRequest{},"Tx chaincode finished OK.")
			// }
	return shim.Success(nil)
}


//takes as input the supplementID and
// a list of users that will be removed from the authorizedUsers
//of that supplement
//
func (t *SimpleChaincode) uninviteUsers(stub shim.ChaincodeStubInterface, args []string)  pb.Response {
		// if len(args) != 2 {
		// return sendErrorEvent(stub,"Incorrect number of arguments. Expecting 2")
		// }
		// //the DiplomaSupplement id
		// suplementId := args[0]
		// emailsString := args[1]
		// emailsArray := strings.Split(emailsString,";")
		//
		// //get the assets from the state
		// assetBytes, err := stub.GetState("assets")
		// if err != nil {
		// return sendErrorEvent(stub,"Failed to get state for key \"assets\"")
		// }
		// //get the supplements from the assets
		// assets := Assets{}
		// json.Unmarshal([]byte(assetBytes), &assets)
		// supplementSlice := assets.Supplements
		//
		// supToUpdate , position := findSupplementInSlice(supplementSlice, suplementId)
		// if position == -1 {
		// return sendErrorEvent(stub,"No supplement found with the given ID"+suplementId)
		// }
		//
		// // Here the ABAC API is called to verify the attributes, only then will the
		// // supplement be updated
		// isStudent, _ := stub.VerifyAttribute("typeOfUser", []byte("Student"))
		// isOwner, _ := stub.VerifyAttribute("eID", []byte(supToUpdate.Owner))
		// if isStudent && isOwner{
		// // authorizedUsers := supToUpdate.Authorized
		// for _, mail := range emailsArray{
		// 	for index, authUser := range supToUpdate.Authorized {
		// 		if(mail == authUser.Email){
		// 			supToUpdate.Authorized = removeAuthUserFromSlice(supToUpdate.Authorized,index)
		// 			break
		// 		}
		// 	}
		// }
		// //delete the old version of the supplement
		// supplementSlice = removeFromSupSlice(supplementSlice,position)
		// //add the new supplement
		// supplementSlice = append(supplementSlice,supToUpdate)
		//
		// assets.Supplements = supplementSlice
		//
		// //update the state with the new assets
		// encodedAssets,err  := json.Marshal(assets)
		// if err != nil {
		// 	return sendErrorEvent(stub,"Error Marshaling Assets")
		// }
		// err = stub.PutState("assets", []byte(encodedAssets))
		// if err != nil {
		// 	return sendErrorEvent(stub,"Error putting assets")
		//
		// }
		// //Execution of chaincode finishe successfully
		// sendSuccessEvent(stub,PublishRequest{},"Tx chaincode finished OK.")
		// }else{
		// 	return sendErrorEvent(stub,"User not allowed to do this action")
		// }
	return shim.Success(nil)
}





	func sendSuccessEvent(stub shim.ChaincodeStubInterface, pubRequest PublishRequest, message string) pb.Response{
			event := CustomEvent{Message: message, Body: pubRequest, TxId : stub.GetTxID()}
			eventJSON,err := json.Marshal(event)
			if err != nil{
				sendErrorEvent(stub,"could not marshal event")
			}
			tosend := string(eventJSON)
			err = stub.SetEvent("evtsender", []byte(tosend))
			if err != nil {
				shim.Error(err.Error())
			}
			return shim.Success(nil);
	}


		//sends an errorEvent Message and returns the error
		func sendErrorEvent(stub shim.ChaincodeStubInterface, message string) pb.Response{
			tosend := message + "." + stub.GetTxID()
			err := stub.SetEvent("evtsender", []byte(tosend))
			if err != nil {
				shim.Error(err.Error())
			}
			return shim.Error(tosend)
		}


		func findSupplementInSlice(s []DiplomaSupplement, supplementId string) (res DiplomaSupplement, pos int){
			pos = -1
			for index,element := range s {
				// element is the element from someSlice for where we are
				if element.Id == supplementId {
					res = element
					pos = index
				}
			}
			return res, pos
		}


		func findDipSupMapInSlice(s []DiplomaSupplementMap, dsHash string) (res DiplomaSupplementMap, pos int){
			pos = -1
			for index,element := range s {
				// element is the element from someSlice for where we are
				if element.DSHash == dsHash {
					res = element
					pos = index
				}
			}
			return res, pos
		}





		/**
		A DiplomaSupplement slice, s
		The position of the supplement to remove, i
		**/
		func removeFromSupSlice(s []DiplomaSupplement, i int) []DiplomaSupplement {
			s[len(s)-1], s[i] = s[i], s[len(s)-1]
			return s[:len(s)-1]
		}


		/**
		A DiplomaSupplement slice, s
		The position of the supplement to remove, i
		**/
		func removeFromReqSlice(s []PublishRequest, i int) []PublishRequest {
			s[len(s)-1], s[i] = s[i], s[len(s)-1]
			return s[:len(s)-1]
		}

		/**
		A DiplomaSupplementMap slice, s
		The position of the dsMap to remove, i
		**/
		func removeDipSupMapFromSlice(s []DiplomaSupplementMap, i int) []DiplomaSupplementMap {
			s[len(s)-1], s[i] = s[i], s[len(s)-1]
			return s[:len(s)-1]
		}

		/**
		A AuthorizedUser slice, s
		The position of the supplement to remove, i
		**/
		func removeAuthUserFromSlice(s []AuthorizedUser, i int) []AuthorizedUser {
			s[len(s)-1], s[i] = s[i], s[len(s)-1]
			return s[:len(s)-1]
		}


		/*
		make and return a random string of n-length
		*/
		func getRandString(n int) string {
			b := make([]byte, n)
			if _, err := rand.Read(b); err != nil {
				fmt.Printf("Error making random string: %s", err)
			}
			return fmt.Sprintf("%X", b)
		}

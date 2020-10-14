public with sharing class contactController {
   @AuraEnabled(cacheable=true)
   public static List<Contact> getRelatedContacts(String accId){
       List<Contact> conList = [SELECT Id, Name, Title, Email, Phone,AccountId
                                FROM Contact
                                WHERE AccountId = :accId
                                WITH SECURITY_ENFORCED];
        return conList;
   }
}

global class AccountSegmentationReorgDataFix implements Database.Batchable<sObject>, Database.Stateful{
    
    private class DivAndBu{
        public String div; 

        public String bu;

        public DivAndBu(String pdiv, String pbu){
            this.div = pdiv;
            this.bu = pbu;
        }
    }

    private static final String FIND_ACCOUNT_SEGMENTATION_QUERY = 
        'SELECT Business_Line_BU__c, DIV__c, Product_Group__c, Product_Group__r.Product_Group_Code__c, Segment_Level__c ' +
        'FROM Customer_Segmentation__c ' + 
        'WHERE Account__r.Active__c = true ';
        //' and Id = \'a6Q20000000ls3XEAQ\'';
    private static final Map<String, DivAndBu> BU_2_NEW_BU_AND_DIV = new Map<String, DivAndBu>{
        'DMPC' => new  DivAndBu('EP', 'EPPE')
    };
;
    private static final String ACCOUNT_SEGMENTATION_SEGMENT_LEVEL_BUSINESS_UNIT = 'Business Unit';

    private static final Map<String,String> OLD_DIVISION_2_NEW_DIVISION = new Map<String,String>{
        'DM' => 'RM',
        'PA' => 'IA'
    };

    private static final Map<String,String> OLD_BUSINESS_UNIT_2_NEW_BUSINESS_UNIT = new Map<String,String>{
        'EPLS' => 'EPES',
        'EPCW' => 'EPIP',
        'EPBS' => 'EPPC',
        'PACT' => 'IACT',
        'PAMA' => 'IAMP',
        'PAMP' => 'IAMA',
        'PAOG' => 'IAOG',
        'PAPG' => 'IAPG',
        'PAPI' => 'IAPI',
        'PASU' => 'IASU',
        'PATU' => 'IATU',
        'DMDR' => 'RMDR',
        'DMMG' => 'RMMG',
        'DMRO' => 'RMRO',
        'DMSU' => 'RMSU'
    };

    private static final Map<String,String> OLD_PRODUCT_GROUP_CODE_2_NEW_CODE = new Map<String,String>{
        '3104' => null ,
        '3114' => null ,
        '3122' => '3099' ,
        '3123' => '3099' ,
        '3136' => null ,
        '3140' => null ,
        '3132' => '3133' ,
        '3117' => null ,
        '4413' => null ,
        '7711' => null ,
        '7715' => '7713' ,
        '7718' => null ,
        '3128' => '3127' ,
        '4416' => null ,
        '4600' => null ,
        '4102' => '4101' ,
        '4158' => null ,
        '4494' => null ,
        '2200' => null ,
        '2818' => null ,
        '1724' => null ,
        '1789' => null ,
        '2867' => null ,
        '2881' => '2882' ,
        '4113' => null ,
        '4119' => null ,
        '4138' => null ,
        '4139' => null ,
        '4109' => null ,
        '4111' => null ,
        '4116' => null ,
        '4149' => null ,
        '4164' => null ,
        '4318' => null ,
        '4319' => null ,
        '4329' => null ,
        '4336' => null ,
        '4531' => null ,
        '9951' => null ,
        '2213' => null ,
        '2221' => '2222' ,
        '2225' => null ,
        '6699' => null ,
        '4321' => null ,
        '3075' => '3078' ,
        '3076' => '3079' ,
        '3080' => '3078' ,
        '3081' => '3079' ,
        '2897' => '2891' ,
        '3137' => '3131' 
        //'1342' =>  '9030' // 9030/9031/7712/9941 
    };

    public Map<Id, Product_Group__c> id2ProductGroup = null;
    public Map<String, Product_Group__c> name2ProductGroup = null;
    public Map<Id, Id> oldProductGroupId2NewProductGroupId = null;
    public Set<Id> objectsThatWereNotUpdated = new Set<Id>();
    
    global AccountSegmentationReorgDataFix() {
        id2ProductGroup = new Map<Id, Product_Group__c>([
            SELECT Name, Division__c, Business_Unit__c, Product_Group_Code__c 
            FROM Product_Group__c   
        ]);
            
        name2ProductGroup = new Map<String, Product_Group__c>();

        for( Product_Group__c theProductGroup : id2ProductGroup.values()  ){
            name2ProductGroup.put( theProductGroup.Product_Group_Code__c, theProductGroup);
        }
        
        oldProductGroupId2NewProductGroupId = new Map<Id, Id>();
        for(String theOldCode : name2ProductGroup.keySet() ) {
            Product_Group__c oldProductGroup = name2ProductGroup.get( theOldCode );
            if(OLD_PRODUCT_GROUP_CODE_2_NEW_CODE.containsKey( theOldCode ) == false){                
                continue;
            }           
            String theNewCode = OLD_PRODUCT_GROUP_CODE_2_NEW_CODE.get( theOldCode );
            Id newProductGroupId = null;
            if( String.isNotBlank( theNewCode) ){ 
                Product_Group__c newProductGroup = name2ProductGroup.get( theNewCode );
                newProductGroupId = newProductGroup.Id;
            }
            oldProductGroupId2NewProductGroupId.put( oldProductGroup.Id, newProductGroupId );               
        }
        for( String key : oldProductGroupId2NewProductGroupId.keyset() ){
            System.debug( key +'=>' + oldProductGroupId2NewProductGroupId.get( key ));
        } 
        
    }
    
    global Database.QueryLocator start(Database.BatchableContext BC) {      
        return Database.getQueryLocator( FIND_ACCOUNT_SEGMENTATION_QUERY );
    }

    global void execute(Database.BatchableContext BC, List<sObject> scope) {
        List<Customer_Segmentation__c> accountSegmentations = (List<Customer_Segmentation__c>)scope;
        List<Customer_Segmentation__c> accountSegmentations2Update = new List<Customer_Segmentation__c>();
        for( Customer_Segmentation__c theSegmentation : accountSegmentations){
            Id oldGroupId = theSegmentation.Product_Group__c;
            String oldDiv = theSegmentation.DIV__c;
            String oldBu = theSegmentation.Business_Line_BU__c;
            updateExceptional( theSegmentation );
            updateProductGroup( theSegmentation );
            updateDIVandBU( theSegmentation );
            if(theSegmentation.Product_Group__c != oldGroupId ||
                theSegmentation.DIV__c != oldDiv ||
                theSegmentation.Business_Line_BU__c != oldBu){

                accountSegmentations2Update.add( theSegmentation );
                System.debug( 'theSegmentation = ' + theSegmentation );
            }

        }          
        Database.SaveResult[] results = Database.update( accountSegmentations2Update, false );
        for(Integer i = 0; i < results.size(); i++ ){
            Database.SaveResult theResult = results[ i ];
            if( theResult.isSuccess() ){
                continue;
            }           
            objectsThatWereNotUpdated.add( accountSegmentations2Update[ i ].Id );   
        }
    }
    
    global void finish(Database.BatchableContext BC) {
        String message = 'Following Customer Segmentations were not updated updated ' + String.join( new List<Id>(objectsThatWereNotUpdated), ',' );
        System.debug( message );
        Messaging.SingleEmailMessage theEmail = new Messaging.SingleEmailMessage();
        theEmail.setTargetObjectId( UserInfo.getUserId() );
        theEmail.setSubject( 'Following Customer Segmentations were not updated updated ' );            
        theEmail.setPlainTextBody( message );           
        theEmail.setSaveAsActivity( false );
        Messaging.sendEmail( new Messaging.SingleEmailMessage[] { theEmail } ); 
    }

    private void updateExceptional( Customer_Segmentation__c theSegmentation ){
        String oldBu = theSegmentation.Business_Line_BU__c; 
        if( BU_2_NEW_BU_AND_DIV.containsKey( oldBu ) == false  ){
            return;
        }
        DivAndBu theDivAndBu = BU_2_NEW_BU_AND_DIV.get( oldBu );
        theSegmentation.DIV__c = theDivAndBu.div;
        theSegmentation.Business_Line_BU__c = theDivAndBu.bu;
    }

    private void updateProductGroup( Customer_Segmentation__c theSegmentation ) {
        Id oldGroupId = theSegmentation.Product_Group__c;
        if( oldGroupId == null ){
            return;
        }             
        if( oldProductGroupId2NewProductGroupId.containsKey( oldGroupId ) == false ){
            return;
        }
        Id newGroupId = oldProductGroupId2NewProductGroupId.get( oldGroupId ); 
        theSegmentation.Product_Group__c = newGroupId;
        if( String.isBlank( newGroupId ) ){ // change segmentation level
            theSegmentation.Segment_Level__c = ACCOUNT_SEGMENTATION_SEGMENT_LEVEL_BUSINESS_UNIT;
            theSegmentation.Product__c = null;
        }
    }

    private void updateDIVandBU( Customer_Segmentation__c theSegmentation ) {
        Id groupId = theSegmentation.Product_Group__c;
        String newDiv = null;
        String newBu = null;
        if( groupId == null ){
            newDiv = OLD_DIVISION_2_NEW_DIVISION.containsKey( theSegmentation.DIV__c ) ?
                OLD_DIVISION_2_NEW_DIVISION.get( theSegmentation.DIV__c ) :
                theSegmentation.DIV__c;
            newBu = OLD_BUSINESS_UNIT_2_NEW_BUSINESS_UNIT.containsKey( theSegmentation.Business_Line_BU__c ) ?
                OLD_BUSINESS_UNIT_2_NEW_BUSINESS_UNIT.get( theSegmentation.Business_Line_BU__c ) :
                theSegmentation.Business_Line_BU__c;                 
        } else {
            Product_Group__c theGroup = id2ProductGroup.get( groupId );
            newDiv =  theGroup.Division__c;
            newBu = theGroup.Business_Unit__c;
        }
        theSegmentation.DIV__c = newDiv;
        theSegmentation.Business_Line_BU__c = newBu;
    }
    
}

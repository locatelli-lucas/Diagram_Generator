namespace com.sap.catman.category.categorySpend;

@cds.persistence.skip
entity SpendByCategory {
    categoryId      : String(4000);
    planId          : String(200);
    categoryCode    : String(20);
    categoryName    : String(4000);
    aribaCodeId     : String(200);
    totalSpend      : Decimal(28,5);
    currency        : String(4000);
    region          : String(4000);
    quarters        : array of {
        quarter     : String(200);
        spend       : Decimal(28,5);
    }
}

@cds.persistence.skip
entity SpendBySubCategory {
    categoryId      : String(4000);
    planId          : String(200);
    subCategoryId   : String(4000);
    subCategoryCode : String(20);
    subCategoryName : String(4000);
    spend           : Decimal(28,5);
    currency        : String(4000);
    region          : String(4000);
}

@cds.persistence.skip
entity SpendBySupplier {

    preferencing               : Composition of one Preferencing;
    risk                       : Composition of one Risk;
}

@cds.persistence.skip
entity Preferencing {
    preferencing          : Integer;
    preferencingLocalized : String;
}

@cds.persistence.skip
entity SpendByRegion {
    categoryId   : String(4000);
    planId      : String(200);
    totalSpend   : Decimal(28,5);
    currency     : String(4000);
    region       : String(4000);
    countries    : array of {
        country  : String(4000);
        spend    : Decimal(28,5);
    }
}

type RiskExposureCategoryModelCds {
    name              : String;
    exposure          : Integer;
    exposureLevel     : Integer;
    exposureLocalized : String;
}

@cds.persistence.skip
entity Risk {
    riskExposureCategoryModel    : array of RiskExposureCategoryModelCds;
}
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createSocialMedia,
  createStore,
  createStoreBranch,
  createStoreDocuments,
  deleteSocialMedia,
  deleteStoreDocuments,
  getBranchDetails,
  getBranchesList,
  getSocialMediaList,
  getStoreDetail,
  getStoreDocumentsList,
  getStoreList,
  getStoresCategories,
  updateStore,
} from "./store";
import {
  BranchItem,
  DocumentItem,
  GetStoreDetailResponse,
  SocialMediaResp,
  StoreCategoryItem,
  StoreItem,
} from "./types";

interface StoreInitialState {
  storeStateLoading: boolean;
  branchStateLoading: boolean;
  documentsStateLoading: boolean;
  socialMediaStateLoading: boolean;

  //getting the list of store (probably useful for customer)
  storeListData: StoreItem[] | null;
  storeListError: string | null;

  //for registering new store(can careate only one store)
  storeCreateData: GetStoreDetailResponse | null;
  storeCreateError: string | null;
  //creating store
  storeUpdateData: GetStoreDetailResponse | null;
  storeUpdateError: string | null;
  //getting the detail of specific store (for store admin)
  storeDetailData: GetStoreDetailResponse | null;
  storeDetailError: string | null;

  //storeDocuments List Data
  storeDocumentsData: DocumentItem[] | null;
  storeDocumentsError: string | null;
  //Store Documents Create Data
  storeDocumentsCreateData: DocumentItem[] | null;
  storeDocumentsCreateError: string | null;
  //Store Documents Delete Data
  storeDocumentsDeleteData: DocumentItem[] | null;
  storeDocumentsDeleteError: string | null;

  //branch list data of store
  branchesData: BranchItem[] | null;
  branchesError: string | null;
  //branch create data of store
  creteBranchData: BranchItem | null;
  createBranchError: string | null;
  //branch detail data of specicic store
  branchDetailsData: BranchItem | null;
  branchDetailsError: string | null;

  //social media list data
  socialMediaData: SocialMediaResp[] | null;
  socialMediaError: string | null;
  //social media create data
  socialMediaCreateData: SocialMediaResp[] | null;
  socialMediaCreateError: string | null;
  //social media delete data
  socialMediaDeleteData: SocialMediaResp[] | null;
  socialMediaDeleteError: string | null;

  //for getting the list of categories for store 
  storeCategoriesData: StoreCategoryItem[] | null
  storeCategoriesError: string | null

}

// Initial state
const initialState: StoreInitialState = {
  storeStateLoading: false,
  branchStateLoading: false,
  documentsStateLoading: false,
  socialMediaStateLoading: false,

  //for list of stores(useful for customer)
  storeListData: null,
  storeListError: null,

  //create store
  storeCreateData: null,
  storeCreateError: null,
  //update store
  storeUpdateData: null,
  storeUpdateError: null,
  //for detail info of specific branch
  storeDetailData: null,
  storeDetailError: null,

  //storeDocuments List Data
  storeDocumentsData: null,
  storeDocumentsError: null,
  //Store Documents Create Data
  storeDocumentsCreateData: null,
  storeDocumentsCreateError: null,
  //Store Documents Delete Data
  storeDocumentsDeleteData: null,
  storeDocumentsDeleteError: null,

  //for list of branches of specific store
  branchesData: null,
  branchesError: null,
  //for creating branch
  creteBranchData: null,
  createBranchError: null,
  //to get the detail of one branch
  branchDetailsData: null,
  branchDetailsError: null,

  //social media list data
  socialMediaData: null,
  socialMediaError: null,
  //social media create data
  socialMediaCreateData: null,
  socialMediaCreateError: null,
  //social media delete data
  socialMediaDeleteData: null,
  socialMediaDeleteError: null,


  //for getting the list of categories for store 
  storeCategoriesData: null,
  storeCategoriesError: null
};


const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    clearAllStoreState: () => initialState,
    clearStoreListState: (state) => {
      state.storeListData = null;
      state.storeListError = null;
    },

    clearStoreCreateState: (state) => {
      state.storeCreateData = null;
      state.storeCreateError = null;
    },

    clearStoreUpdateState: (state) => {
      state.storeUpdateData = null;
      state.storeUpdateError = null;
    },

    clearStoreDetailState: (state) => {
      state.storeDetailData = null;
      state.storeDetailError = null;
    },

    clearCreateBranchState: (state) => {
      state.creteBranchData = null;
      state.createBranchError = null;
    },

    clearBranchDetailsState: (state) => {
      state.branchDetailsData = null;
      state.branchDetailsError = null;
    },

    clearStoreDocumentsState: (state) => {
      state.storeDocumentsData = null;
      state.storeDocumentsError = null;
      state.storeDocumentsDeleteData = null;
      state.storeDocumentsDeleteError = null;
    },

    clearStoreDocumentsCreateState: (state) => {
      state.storeDocumentsCreateData = null;
      state.storeDocumentsCreateError = null;
    },

    clearSocialMediaState: (state) => {
      state.socialMediaData = null;
      state.socialMediaError = null;
      state.socialMediaDeleteData = null;
      state.socialMediaDeleteError = null;
    },

    clearSocialMediaCreateState: (state) => {
      state.socialMediaCreateData = null;
      state.socialMediaCreateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //*************************************************************
      //for store
      //*************************************************************
      //to get the list of store this is only applicable for customer side
      .addCase(getStoreList.pending, (state) => {
        state.storeStateLoading = true;
        state.storeListError = null;
      })
      .addCase(getStoreList.fulfilled, (state, action) => {
        state.storeStateLoading = false;
        state.storeListData = action.payload.results;
        state.storeListError = null;
      })
      .addCase(
        getStoreList.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.storeListData = null;
          state.storeStateLoading = false;

          state.storeListError = action.payload || "Failed to fetch store";
        }
      )
      //for getting the detail of the store by store admin
      .addCase(getStoreDetail.pending, (state) => {
        state.storeStateLoading = true;
        state.storeDetailError = null;
      })
      .addCase(
        getStoreDetail.fulfilled,
        (state, action: PayloadAction<GetStoreDetailResponse>) => {
          state.storeStateLoading = false;
          state.storeDetailData = action.payload;
          state.storeDetailError = null;
        }
      )
      .addCase(
        getStoreDetail.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.storeDetailData = null;
          state.storeStateLoading = false;
          state.storeDetailError = action.payload || "Failed to fetch store";
        }
      )

      //creating store
      .addCase(createStore.pending, (state) => {
        state.storeStateLoading = true;
        state.storeCreateData = null;
      })
      .addCase(
        createStore.fulfilled,
        (state, action: PayloadAction<GetStoreDetailResponse>) => {
          state.storeStateLoading = false;
          state.storeCreateData = action.payload;
          state.storeDetailData = action.payload;
          state.storeCreateError = null;
        }
      )
      .addCase(
        createStore.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.storeCreateData = null;
          state.storeStateLoading = false;
          state.storeCreateError = action.payload || "Failed to create store";
        }
      )
      //update store detail
      .addCase(updateStore.pending, (state) => {
        state.storeStateLoading = true;
        state.storeUpdateError = null;
      })
      .addCase(
        updateStore.fulfilled,
        (state, action: PayloadAction<GetStoreDetailResponse>) => {
          state.storeStateLoading = false;
          state.storeUpdateData = action.payload;
          state.storeDetailData = action.payload;
          state.storeUpdateError = null;
        }
      )
      .addCase(
        updateStore.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.storeUpdateData = null;
          state.storeStateLoading = false;
          state.storeUpdateError = action.payload || "Failed to fetch store";
        }
      )

      //*************************************************************
      //for branches
      //*************************************************************
      //get the list of branches of specific store
      .addCase(getBranchesList.pending, (state) => {
        state.branchStateLoading = true;
        state.branchesError = null;
      })
      .addCase(
        getBranchesList.fulfilled,
        (state, action: PayloadAction<BranchItem[]>) => {
          state.branchStateLoading = false;
          state.branchesData = action.payload;
          state.branchesError = null;
        }
      )
      .addCase(
        getBranchesList.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.branchesData = null;
          state.branchStateLoading = false;
          state.branchesError =
            action.payload || "Failed to fetch list of branches";
        }
      )

      //creating branches
      .addCase(createStoreBranch.pending, (state) => {
        state.branchStateLoading = true;
        state.createBranchError = null;
      })
      .addCase(
        createStoreBranch.fulfilled,
        (state, action: PayloadAction<BranchItem>) => {
          state.branchStateLoading = false;
          state.creteBranchData = action.payload;
          state.branchesError = null;
        }
      )
      .addCase(
        createStoreBranch.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.creteBranchData = null;
          state.branchStateLoading = false;
          state.createBranchError = action.payload || "Failed to create branch";
        }
      )

      //getting branch details
      .addCase(getBranchDetails.pending, (state) => {
        state.branchStateLoading = true;
        state.branchDetailsError = null;
      })
      .addCase(
        getBranchDetails.fulfilled,
        (state, action: PayloadAction<BranchItem>) => {
          state.branchStateLoading = false;
          state.branchDetailsData = action.payload;
          state.branchDetailsData = action.payload;
          state.branchDetailsError = null;
        }
      )
      .addCase(
        getBranchDetails.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.branchDetailsData = null;
          state.branchStateLoading = false;
          state.branchDetailsError =
            action.payload || "Failed to fetch the detail of branches";
        }
      )

      //*************************************************************
      //for Documents
      //*************************************************************
      //get store documents list
      .addCase(getStoreDocumentsList.pending, (state) => {
        state.documentsStateLoading = true;
        state.storeDocumentsError = null;
      })
      .addCase(
        getStoreDocumentsList.fulfilled,
        (state, action: PayloadAction<DocumentItem[]>) => {
          state.documentsStateLoading = false;
          state.storeDocumentsData = action.payload;
          state.storeDocumentsError = null;
        }
      )
      .addCase(
        getStoreDocumentsList.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.storeDocumentsData = null;
          state.documentsStateLoading = false;
          state.storeDocumentsError =
            action.payload || "Failed to fetch store documents";
        }
      )

      //create store documents
      .addCase(createStoreDocuments.pending, (state) => {
        state.documentsStateLoading = true;
        state.storeDocumentsCreateError = null;
      })
      .addCase(
        createStoreDocuments.fulfilled,
        (state, action: PayloadAction<DocumentItem[]>) => {
          state.documentsStateLoading = false;
          state.storeDocumentsCreateData = action.payload;
          state.storeDocumentsData = action.payload;
          state.storeDocumentsCreateError = null;
        }
      )
      .addCase(
        createStoreDocuments.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.storeDocumentsCreateData = null;
          state.documentsStateLoading = false;
          state.storeDocumentsCreateError =
            action.payload || "Failed to create store document";
        }
      )
      //delete store documents
      .addCase(deleteStoreDocuments.pending, (state) => {
        state.documentsStateLoading = true;
        state.storeDocumentsDeleteError = null;
      })
      .addCase(
        deleteStoreDocuments.fulfilled,
        (state, action: PayloadAction<DocumentItem[]>) => {
          state.documentsStateLoading = false;
          state.storeDocumentsDeleteData = action.payload;
          state.storeDocumentsData = action.payload;
          state.storeDocumentsDeleteError = null;
        }
      )
      .addCase(
        deleteStoreDocuments.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.documentsStateLoading = false;
          state.storeDocumentsDeleteError =
            action.payload || "Failed to delete store document";
        }
      )

      //*************************************************************
      //for SocialMedia
      //*************************************************************
      //get social media list
      .addCase(getSocialMediaList.pending, (state) => {
        state.socialMediaStateLoading = true;
        state.socialMediaError = null;
      })
      .addCase(
        getSocialMediaList.fulfilled,
        (state, action: PayloadAction<SocialMediaResp[]>) => {
          state.socialMediaStateLoading = false;
          state.socialMediaData = action.payload;
          state.socialMediaError = null;
        }
      )
      .addCase(
        getSocialMediaList.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.socialMediaData = null;
          state.socialMediaStateLoading = false;
          state.socialMediaError =
            action.payload || "Failed to fetch social media list";
        }
      )

      //create social media
      .addCase(createSocialMedia.pending, (state) => {
        state.socialMediaStateLoading = true;
        state.socialMediaCreateError = null;
      })
      .addCase(
        createSocialMedia.fulfilled,
        (state, action: PayloadAction<SocialMediaResp[]>) => {
          state.socialMediaStateLoading = false;
          state.socialMediaCreateData = action.payload;
          state.socialMediaData = action.payload;
          state.socialMediaCreateError = null;
        }
      )
      .addCase(
        createSocialMedia.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.socialMediaCreateData = null;
          state.socialMediaStateLoading = false;
          state.socialMediaCreateError =
            action.payload || "Failed to create social media item";
        }
      )

      //delete social media
      .addCase(deleteSocialMedia.pending, (state) => {
        state.socialMediaStateLoading = true;
        state.socialMediaDeleteError = null;
      })
      .addCase(
        deleteSocialMedia.fulfilled,
        (state, action: PayloadAction<SocialMediaResp[]>) => {
          state.socialMediaStateLoading = false;
          state.socialMediaData = action.payload;
          state.socialMediaDeleteError = null;
        }
      )
      .addCase(
        deleteSocialMedia.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.socialMediaData = null;
          state.socialMediaStateLoading = false;
          state.socialMediaDeleteError =
            action.payload || "Failed to delete social media item";
        }
      )

      //*************************************************************
      //for StoreCategories List
      //*************************************************************

      .addCase(getStoresCategories.pending, (state) => {
        state.storeCategoriesError = null;
      })
      .addCase(
        getStoresCategories.fulfilled,
        (state, action: PayloadAction<StoreCategoryItem[]>) => {
          state.storeCategoriesData = action.payload;
          state.storeCategoriesError = null;
        }
      )
      .addCase(
        getStoresCategories.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.storeCategoriesError =
            action.payload || "Failed to get the list of store caegories";
        }
      );

  },
});

export const {
  clearAllStoreState,
  clearStoreDetailState,
  clearStoreListState,
  clearCreateBranchState,
  clearBranchDetailsState,
  clearStoreUpdateState,
  clearStoreCreateState,
  clearStoreDocumentsState,
  clearStoreDocumentsCreateState,
  clearSocialMediaState,
  clearSocialMediaCreateState,
} = storeSlice.actions;
export default storeSlice.reducer;

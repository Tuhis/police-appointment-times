import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState, AppThunk } from '../../app/store';
import { selectVisibleRegions, selectVisibleStations } from '../filters/filtersSlice';
import { FreeSlotsResponse } from './interfaces/IFreeSlotsResponse';
import { EnrichedStation } from './interfaces/IStation';
import { fetchFreeSlots, fetchFreeSlotsForStation, fetchStations } from './policeAPI';

export interface PoliceState {
  status: 'idle' | 'loading' | 'failed';
  stations: {[id: string]: EnrichedStation};
  freeSlots: FreeSlotsResponse;
  freeSlotsStatus: 'idle' | 'loading' | 'failed';
  chosenStationFreeSlots: string[];
  chosenStationFreeSlotsStatus: 'idle' | 'loading' | 'failed';
  chosenStationId: string | null;
  chosenDate: string
  chosenRegion: string | null;
}

const initialState: PoliceState = {
  status: 'idle',
  stations: {},
  freeSlots: [],
  freeSlotsStatus: 'idle',
  chosenStationFreeSlots: [],
  chosenStationFreeSlotsStatus: 'idle',
  chosenStationId: null,
  chosenDate: "",
  chosenRegion: null
};

export const updateStationsAsync = createAsyncThunk(
  'police/fetchStations',
  async () => {
    const response = await fetchStations();

    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const updateFreeSlotsAsync = createAsyncThunk(
  'police/fetchFreeSlots',
  async () => {
    const response = await fetchFreeSlots();

    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const updateChosenStationFreeSlotsAsync = createAsyncThunk(
  'police/fetchFreeSlotsForStation',
  async (params: { stationId: string, dateString: string}) => {
    return await fetchFreeSlotsForStation(params.stationId, params.dateString);
  }
);

export const policeSlice = createSlice({
  name: 'police',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    chooseStation: (state, action: PayloadAction<string>) => {
      state.chosenStationId = action.payload;
    },
    closeStation: (state) => {
      state.chosenStationId = null;
    },
    chooseDate: (state, action: PayloadAction<string>) => {
      state.chosenDate = action.payload;
    },
    chooseRegion: (state, action: PayloadAction<string>) => {
      state.chosenRegion = action.payload;
    },
    closeRegion: (state) => {
      state.chosenRegion = null;
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(updateStationsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateStationsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.stations = action.payload;
      })
      .addCase(updateFreeSlotsAsync.pending, (state) => {
        state.freeSlotsStatus = 'loading';
      })
      .addCase(updateFreeSlotsAsync.fulfilled, (state, action) => {
        state.freeSlotsStatus = 'idle';
        if (_.isEmpty(action.payload)) state.freeSlotsStatus = 'failed';
        state.freeSlots = action.payload;
      })
      .addCase(updateChosenStationFreeSlotsAsync.pending, (state) => {
        state.chosenStationFreeSlotsStatus = 'loading';
      })
      .addCase(updateChosenStationFreeSlotsAsync.fulfilled, (state, action) => {
        state.chosenStationFreeSlotsStatus = 'idle';
        state.chosenStationFreeSlots = action.payload;
      });
  },
});

export const { chooseStation, closeStation, chooseDate, chooseRegion, closeRegion } = policeSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;
export const selectStations = (state: RootState) => state.police.stations;
export const selectStationsFiltered = (state: RootState) => {
  const visibleRegions = selectVisibleRegions(state);

  return _.omitBy(state.police.stations, station => !_.includes(visibleRegions, station.region));
};
export const selectFreeSlots = (state: RootState) => state.police.freeSlots;
export const selectFreeSlotsFiltered = (state: RootState) => {
  const stationsFilteredIds = _.map(selectStationsFiltered(state), station => station.id);

  return _.chain(state.police.freeSlots)
    .map(date => {
      const slotsPerStation = _.omitBy(date.slotsPerStation, (slotCount, stationId) => !_.includes(stationsFilteredIds, stationId));

      return {
        date: date.date,
        dateString: date.dateString,
        freeSlots: _.sum(_.values(slotsPerStation)),
        stations: _.keys(slotsPerStation),
        slotsPerStation: _.omitBy(date.slotsPerStation, (slotCount, stationId) => !_.includes(stationsFilteredIds, stationId))
      };
    })
    .filter(date => date.freeSlots !== 0)
    .value();
};
export const selectFreeSlotsStatus = (state: RootState) => state.police.freeSlotsStatus;
export const selectChosenStationId = (state: RootState) => state.police.chosenStationId;
export const selectChosenStationFreeSlots = (state: RootState) => state.police.chosenStationFreeSlots;
export const selectChosenDate = (state: RootState) => state.police.chosenDate;
export const selectChosenStation = (state: RootState) => _.get(state.police.stations, _.isNull(state.police.chosenStationId) ? "" : state.police.chosenStationId);
export const selectChosenRegion = (state: RootState) => state.police.chosenRegion;
export const selectChosenRegionStations = (state: RootState): EnrichedStation[] => {
  const date = _.find(state.police.freeSlots, date => date.dateString === state.police.chosenDate);

  if (_.isUndefined(date)) return [];

  const stationIds = date.stations;

  return _.chain(state.police.stations)
    .filter((station) => _.includes(stationIds, station.id))
    .filter(station => station.region === state.police.chosenRegion)
    .value();
};
export const selectFreeTimeslotsOnChosenDayPerStation = (state: RootState): {[id: string]: number} => {
  const date = _.find(state.police.freeSlots, date => date.dateString === state.police.chosenDate);

  if (_.isUndefined(date)) return {};

  return date.slotsPerStation
}
export const selectRegions = (state: RootState) => _.chain(state.police.stations).map(station => station.region).uniq().sort().value();

// TODO Add action for updating data if old

export default policeSlice.reducer;

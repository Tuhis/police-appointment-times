import React, { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectFreeSlots, updateFreeSlotsAgeAsync, updateFreeSlotsAsync, updateStationsAsync } from './policeSlice';

export function PoliceDataLoader() {
  const freeSlots = useAppSelector(selectFreeSlots);
  const dispatch = useAppDispatch();

  useEffect(() => {
      dispatch(updateStationsAsync());
      dispatch(updateFreeSlotsAsync());
      dispatch(updateFreeSlotsAgeAsync());
  }, [dispatch]);

  return (
      <React.Fragment />
  );
}

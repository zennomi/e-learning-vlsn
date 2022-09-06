import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

const initialState = {
    activeStep: 0,
    cart: []
}

const slice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addCart(state, action) {
            if (!state.cart.find(product => product.id == action.payload.id)) state.cart.push(action.payload);
        },
        removeCart(state, action) {
            const updateCourses = state.cart.filter((course) => course.id !== action.payload);
            state.cart = updateCourses;
        },
        onBackStep(state) {
            state.checkout.activeStep -= 1;
        },
        onNextStep(state) {
            state.checkout.activeStep += 1;
        },
        onGotoStep(state, action) {
            const goToStep = action.payload;
            state.checkout.activeStep = goToStep;
        },
    },
})

export default slice.reducer;

export const { addCart, removeCart, onBackStep, onNextStep, onGotoStep } = slice.actions;
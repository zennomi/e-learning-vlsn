import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    questions: [],
};

const slice = createSlice({
    name: 'createTest',
    initialState,
    reducers: {
        addQuestion(state, action) {
            if (!state.questions.includes(action.payload))
                state.questions.push(action.payload);
        },

        removeQuestion(state, action) {
            const updateQuestions = state.questions.filter(question => question !== action.payload);
            state.questions = updateQuestions;
        },
    }
})

// Reducer
export default slice.reducer;

export const {
    addQuestion,
    removeQuestion,
} = slice.actions;
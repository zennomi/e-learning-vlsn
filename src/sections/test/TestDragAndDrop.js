import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// @mui
import { Card } from '@mui/material';
import Fab from '@mui/material/Fab';
// components
import Label from "../../components/Label";
import Question from '../../components/Question';
import Iconify from '../../components/Iconify';

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
});

export default function ListDragAndDrop({ questions, handleDragEnd, handleRemoveButtonClick }) {

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {questions.map((question, index) => (
                            <Draggable key={question.id} draggableId={question.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Card sx={{ p: 1, m: 1 }}>
                                            <Label>{`Câu ${index + 1}`}</Label>
                                            <Question question={question} />
                                            <Fab
                                                size="small"
                                                aria-label="delete"
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                    bgcolor: 'error.main',
                                                    color: 'common.white'
                                                }}
                                                onClick={() => { handleRemoveButtonClick(question.id) }}
                                            >
                                                <Iconify icon='ep:delete-filled' />
                                            </Fab>
                                        </Card>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}


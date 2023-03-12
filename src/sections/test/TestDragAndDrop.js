import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// @mui
import { Card } from '@mui/material';
import Fab from '@mui/material/Fab';
// components
import Label from "../../components/Label";
import Question from '../../components/Question';
import Iconify from '../../components/Iconify';




export default function ListDragAndDrop({ questions, handleDragEnd, handleRemoveButtonClick }) {

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {questions.map((question, index) => (
                            <Draggable key={question.id} draggableId={question.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Card sx={{ p: 1, m: 1 }}>
                                            <Label sx={{ mb: 0.5 }}>{`Câu ${index + 1}`}</Label>
                                            <Question question={question} />
                                            <Fab
                                                size="small"
                                                aria-label="delete"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
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


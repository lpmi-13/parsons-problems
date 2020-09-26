import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable  } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// some good old Fisher-Yates
const shuffle = arr => {
  var i = arr.length, j, temp;
  while(--i > 0){
    j = Math.floor(Math.random()*(i+1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, original_index, current_index) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : original_index === current_index ? "55AA55" : "#D46A6A",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
});

const CodeSnippet = ({ lines }) => {

   useEffect(() =>{
     setCodeOrder(lines);
   }, [lines]);

    const [codeOrder, setCodeOrder] = useState(shuffle(lines));

    const onDragEnd = (result) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      const items = reorder(
        codeOrder,
        result.source.index,
        result.destination.index
      );

      setCodeOrder(items);
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <pre
                      className="code-content"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {codeOrder.map((item, index) => (
                        <Draggable key={item.line_number.toString()} draggableId={item.line_number.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                index + 1,
                                item.line_number,
                              )}
                            >
                              {item.line_content}
                              {`current index is ${index + 1}`}
                              {`original index is ${item.line_number}`}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </pre>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default CodeSnippet;
import React, { useEffect, useRef, useState } from "react"
import useCreateNote from "../hooks/useCreateNote"
import useNotes from "../hooks/useNotes"
import Note from "../components/Note"
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import { useSelector } from "react-redux";
import ColorPallete from "../components/ColorPallete";
import useUpdateNotes from "../hooks/useUpdateNotes";
import SignIn from "../components/SignIn";
import useGetUser from "../hooks/useGetUser";

const Home = () => {
  const stateNotes = useSelector((state) => state.data.notes)
  const stateUser = useSelector((state) => state.data.user)
  let inputRef = useRef('')

  const { isLoading:userLoading, isSuccess } = useGetUser()
  const {error, isLoading, fetchStatus} = useNotes()
  const {mutate} = useCreateNote()
  const {mutate:updateIndexNums} = useUpdateNotes()

  const [uid, setUid] = useState()
  const [notes, setNotes] = useState()
  const [wordCount, setWordCount] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [showColorPallete, setShowColorPallete] = useState(false)
  const [colorOptionValue, setColorOptionValue] = useState("")
  const [activeNote, setactiveNote] = useState(null)

  useEffect(() => {
      setUid(stateUser?.id)
      setNotes(stateNotes?.data)
  }, [stateNotes?.data, stateUser?.id])

  const handleNoteAdd = (e) => {
    e.preventDefault()
    if(inputRef.current.value.trim() !== "") {
      mutate({data_value: inputRef.current.value.toString(), bg_color: colorOptionValue == "" ? "bg-white" : colorOptionValue, index_num: notes.length > 0 ? notes[0].index_num + 2 : 2, user_id: uid})
      // setNotes(Notes.data)
      setShowInput(false)
    } else {
      inputRef.current.focus();
      setWordCount(0)
    }
      inputRef.current.value = ''
      setWordCount(0)
      setShowInput(false)
  }

  const clearInput = () => {
    setWordCount(0)
    inputRef.current.value = ''
    setColorOptionValue('')
  }

  const closeInput = () => {
    setShowInput(false)
  }

  const handleColorOption = (e) => {
    const getColorValue = (e.target.className).split(" ").filter((x) => /bg-/.test(x))[0]
    setColorOptionValue(getColorValue)
  }

  const onDrop = (position) => {

    if(activeNote == null || activeNote == undefined) return

    var notesCopy = JSON.parse(JSON.stringify(notes))

    const noteToMove = notes.filter(note => note.index_num == activeNote.index_num)
    const updatedNotes = notes.filter((note) => note.index_num !== activeNote.index_num)
    
    updatedNotes.splice(position, 0, noteToMove[0])
    // const getOtherNote = updatedNotes.slice(position + 1, position + 2);

    // console.log("position", position)
    // console.log("notetomoveindex", notes.indexOf(noteToMove[0]))
    // console.log("note to move", noteToMove)
    // console.log('before manipulation', notesCopy)

    notesCopy[position].index_num = notes[notes.indexOf(noteToMove[0])].index_num
    notesCopy[notes.indexOf(noteToMove[0])].index_num = notes[position].index_num

    // console.log("Notes Copy", notesCopy.sort((a,b) => b.index_num - a.index_num))

    setNotes(notesCopy.sort((a,b) => b.index_num - a.index_num))
    updateIndexNums({
      id_one: notesCopy[position].id, 
      index_two: notesCopy[position].index_num, 
      index_one: notesCopy[notes.indexOf(noteToMove[0])].index_num,
      id_two: notesCopy[notes.indexOf(noteToMove[0])].id, 
    })

    // console.log("Notes outside use effect ", notes)
  }

  if(userLoading) return <div className="py-52 w-full  flex justify-center items-center">A moment please...</div>
  if(error) return  <h3>Error: {error}</h3>
  if (stateUser == null) {
    return <SignIn />
  } else {
    if (stateNotes !== null && isSuccess) return (
      <div className="w-full flex flex-col gap-5 px-3 py-5 md:px-10 lg:px-20 md:py-10 justify-center items-center overflow-scroll">
          <div className={showInput ? "fixed w-full h-full top-0 left-0 md:py-10 flex justify-center items-center z-50" : "opacity-0 fixed w-full h-full top-0 left-0 flex justify-center items-center -z-50 duration-300 transition-all"}>
                <div className={showInput && "absolute w-full h-full bg-black/70"} onClick={() => setShowInput(!showInput)}  role="button" aria-disabled="true"></div>
                <div className="w-full h-full md:w-[80%] lg:w-[60%] md:lg-auto group">
                  <form onSubmit={handleNoteAdd} className={showInput ? "scale-100 relative flex flex-col w-full h-full pb-2 bg-white border justify-between rounded-lg shadow-md duration-300 transition-all z-50" : "scale-0 relative gap-4 w-full h-full pb-2 border justify-center items-center rounded-lg shadow-md bg-white duration-300 transition-all"}>
                    <div className="flex items-center justify-end top-2 right-2 px-2 py-2">
                      <button className={"w-8 h-8 z-20 text-black/70 hover:text-neutral hover:bg-black/10 rounded-full transition-all duration-300"} type="button" onClick={closeInput}><ClearRoundedIcon /></button>
                    </div>

                    <textarea type="text" ref={inputRef} onInput={()=> inputRef.current && setWordCount(inputRef.current.value.length)}  className={`w-full h-[90%] outline-none resize-none ${colorOptionValue} p-4 placeholder:text-black text-base rounded-lg z-30 transition-all duration-300`} placeholder="Write Note"/>

                    <div className="relative w-full flex justify-center items-center py-10">
                        <ColorPallete show={showColorPallete} addBackground={handleColorOption}/>
                        
                        {fetchStatus !== "idle" ? <span className="loading loading-spinner loading-sm"></span> : 
                        <div className={`w-full flex justify-center gap-4 items-center px-3 md:px-5 pt-4`}>
                          <div className="flex gap-2 justify-center items-center">
                            <Tooltip title="Choose color" arrow>
                              <i className={`w-10 h-10 flex justify-center items-center rounded-full ${showColorPallete ? 'bg-warning shadow-lg border-none' : 'border-[1px] border-neutral'} hover:bg-warning hover:border-none z-30 transition-all duration-200 cursor-pointer `} onClick={() => setShowColorPallete(!showColorPallete)}>
                                <ColorLensRoundedIcon sx={{ fontSize: 18 }}/>
                              </i>
                            </Tooltip>
                          </div>

                          <Tooltip title="Erase" arrow>
                            <button className={wordCount > 0 ? "w-10 h-10 flex justify-center items-center rounded-full top-2 right-2 px-2 py-2 bg-gray-400 shadow-lg border-none text-white hover:text-neutral transition-all duration-300": "w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"} type="button" onClick={clearInput}><ClearAllRoundedIcon /></button>
                          </Tooltip>


                          <Tooltip title="Add" arrow>
                            <button type="submit" className={wordCount > 0 ? "cursor-pointer w-10 h-10 flex justify-center items-center rounded-full border-[1px] border-neutral bg-neutral text-white z-30 transition-all duration-200" : "cursor-pointer bg-neutral/70 text-white rounded-full w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"}> <CheckRoundedIcon/></button>
                          </Tooltip>
                        </div>
                        }
                    </div>
                  </form>
                </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center">

              {!isLoading && notes?.length > 0 ? <div className="w-full gap-4 flex flex-col items-center justify-center">
                  <div className="w-full gap-4 columns-2 md:columns-3 lg:columns-4 space-y-4 mx-auto">
                    {
                      
                      notes?.map((note) => (
                        <React.Fragment key={note.id}>
                          <Note 
                          noteId={note.id}
                          note={note.data_value}
                          bgColor={note.bg_color}
                          updateId={note.id}
                          draggedNote={note}
                          activeNote={setactiveNote}
                          handleDrop={() => onDrop(notes.indexOf(note))}
                          />
                        </React.Fragment>
                      ))
                    }
                  </div>
              </div> : isLoading ? <div className="py-52 w-full  flex justify-center items-center">A moment please...</div> : 
              <div className="py-40 w-full  flex justify-center items-center">
                <div className="flex flex-col w-full md:w-96 text-neutral-500 justify-center items-center text-center">
                  <DescriptionIcon  sx={{ fontSize: 200 }}/>
                  <p>You have no <b>Noets</b> yet. Click the create below Icon to create one..</p>
                </div>
              </div>
              }
          </div>
            {fetchStatus === "idle" && <Tooltip title="Add Noet" arrow placement="top"  className="fixed bottom-4 md:bottom-10">
              <button type="submit" className="cursor-pointer w-16 h-16 lg:w-[4.5rem] lg:h-[4.5rem] flex justify-center items-center rounded-full hover:bg-neutral bg-gray-700 text-white transition-all duration-300 z-40" onClick={() => setShowInput(!showInput)  & inputRef.current.focus()}> {showInput ? <ClearRoundedIcon sx={{ fontSize: 30 }}/> : <AddRoundedIcon sx={{ fontSize: 30 }}/>}</button>
            </Tooltip>}

      </div>
    )
  }
  

}

export default Home



    // var returnFromSplicedNotes= notesCopy.splice(notes[position], 1, notes[notes.indexOf(noteToMove[0])])[0]
    // notesCopy[notes.indexOf(noteToMove[0])] = returnFromSplicedNotes

    // [notes[notes.indexOf(noteToMove[0])], notes[position]] = [notes[position], notes[notes.indexOf(noteToMove[0])]]
    // console.log(returnFromSplicedNotes)
    // console.log(notes)

    // console.log("id_one", notesCopy[position].id)
    // console.log("index_two", notesCopy[position].index_num)
    // console.log("index_one", notesCopy[notes.indexOf(noteToMove[0])].index_num)
    // console.log("id_two", notesCopy[notes.indexOf(noteToMove[0])].id )


    // console.log("id_one", activeNote.id)
    // console.log("index_two", getOtherNote[0].index_num)
    // console.log("index_one", activeNote.index_num)
    // console.log("id_two", getOtherNote[0].id)


    // console.log(udpatedNotes)
    // console.log(activeNote.id, getOtherNote[0].index_num)

    // updatedNotes.splice(position, 0, noteToMove[0])
    // if((notes.indexOf(noteToMove[0]) - position) > 1) {
    //   getOtherNote = updatedNotes.slice(position + 1, position + 2)
    // const newUpdatedNotes = updatedNotes.filter(note => note.id !== getOtherNote[0].id)
    // const getFormerPosition = notes.indexOf(noteToMove[0])
    // newUpdatedNotes.splice(getFormerPosition, 0, getOtherNote[0])
    // setNotes(newUpdatedNotes)
    // } else {
    //   setNotes(updatedNotes)
    // }

    // setNotes(udpatedNotes)
    // setstatus(`update card with index ${activeNote.index_num} and id ${activeNote.id} to index ${getOtherNote[0].index_num} and ${getOtherNote[0].id}`)



    // console.log("id_one", notesCopy[notes.indexOf(noteToMove[0])].id)
    // console.log("index_two", notesCopy[position].index_num)
    // console.log("index_one", notesCopy[notes.indexOf(noteToMove[0])].index_num)
    // console.log("id_two", notesCopy[position].id)

    // // setNotes(notesCopy.sort((a,b) => b.index_num - a.index_num))
    // updateIndexNums({
    //   id_one: notesCopy[notes.indexOf(noteToMove[0])].id, 
    //   index_two: notesCopy[position].index_num, 
    //   index_one: notesCopy[notes.indexOf(noteToMove[0])].index_num,
    //   id_two: notesCopy[position].id, 
    // })
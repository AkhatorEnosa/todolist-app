import { useState } from "react"
import useDeleteNote from "../hooks/useDeleteNote"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckIcon from '@mui/icons-material/Check';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import useUpdateNote from "../hooks/useUpdateNote";
import ColorPallete from "./ColorPallete";
import Tooltip from '@mui/material/Tooltip';

/* eslint-disable react/prop-types */
const Todo = ({note, noteId, bgColor}) => {

  const [getNote, setGetNote] = useState(note)
  const [wordCount, setWordCount] = useState(note.length)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showColorPallete, setShowColorPallete] = useState(false)
  const [colorOptionValue, setColorOptionValue] = useState("")

  const {mutate, isPending, isSuccess} = useDeleteNote()
  const {mutate:update, isPending:updating, } = useUpdateNote()

  const handleChange = (e) => {
    setGetNote(e.target.value)
    setWordCount(e.target.value.length)
  }

  const handleTodoUpdate = (e) => {
    e.preventDefault()
    if(getNote.trim() !== "") {
      update({data_value: getNote.trim().toString(), id: noteId, bg_color: colorOptionValue})
      setShowEditModal(!showEditModal)
    } else {
      setGetNote('')
      setWordCount(0)
    }
  }

  const clearInput = () => {
    setGetNote(note)
    setWordCount(note.length)
      setShowEditModal(!showEditModal)
      setColorOptionValue("")
  }


  const truncateTodo = (x) => {
      if(x.length > 600) {
          return x.substring(0, 599).concat('...')
      } else  {
          return x
      }
  }

  const Linkify = (markdown) => {
    var urlRegex =/(((https?:\/\/)|(www\.))[^\s]+)/g;
    return markdown.replace(urlRegex, function(url) {
        if(url.substring(0, 3) === "www") {
          return `<a href='https://${url}' id='link'>${url}</a>`
        }
        return `<a href='${url}' id='link'>${url}</a>`
    });
  }

  const handleColorOption = (e) => {
    const getColorValue = (e.target.className).split(" ").filter((x) => /bg-/.test(x))[0]
    setColorOptionValue(getColorValue)
  }
  
  return (
    <div>

        <div className={showEditModal ? "opacity-0 break-inside-avoid w-full pb-6 border-[1px] border-black/10 shadow-md text-lg hover:shadow-lg transition-shadow duration-200  break-words" : `break-inside-avoid w-full group ${bgColor} border-[1px] border-black/10 shadow-md rounded-md text-lg hover:shadow-lg transition-shadow duration-200  break-words z-10`}>
            <p className={note.length > 300 ? "w-full text-sm leading-normal px-3 pt-3 pb-4" : "w-full leading-normal px-3 pt-2 pb-4"} dangerouslySetInnerHTML={{ __html: Linkify(truncateTodo(note)) }}/>
          <div className="w-full px-4 pt-3 pb-2 gap-2 justify-end items-center flex lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
            <Tooltip title="Edit" arrow>
              <i className="w-8 h-8 flex justify-center items-center rounded-full border-[1px] border-neutral hover:bg-neutral/10 hover:border-none z-30 transition-all duration-200 cursor-pointer">
                <EditNoteRoundedIcon onClick={() => setShowEditModal(!showEditModal)} sx={{ fontSize: 18 }}/>
              </i>
            </Tooltip>
            <Tooltip title="Delete" arrow>
            <i className="w-8 h-8 flex justify-center items-center rounded-full border-[1px] border-neutral hover:bg-neutral/10 hover:border-none z-30 transition-all duration-200 cursor-pointer">
              <DeleteRoundedIcon onClick={() => setShowDeleteModal(!showDeleteModal)} sx={{ fontSize: 18 }}/>
            </i>
            </Tooltip>
          </div>
        </div>

        <div className={showEditModal ? "fixed w-full h-full top-0 left-0 flex justify-center items-center z-50" : "opacity-0 fixed w-full h-full top-0 left-0 flex justify-center items-center -z-50 duration-300 transition-all"}>
              <div className="absolute w-full h-full bg-black/70" onClick={() => setShowEditModal(!showEditModal)}></div>
              <div className="w-[80%] lg:w-[60%] h-auto group">
                <form onSubmit={handleTodoUpdate} className={showEditModal ? "scale-100 relative gap-4 w-full h-full pb-2 border justify-center items-center rounded-lg shadow-md bg-white duration-300 transition-all" : "scale-0 relative gap-4 w-full h-full pb-2 border justify-center items-center rounded-lg shadow-md bg-white duration-300 transition-all"}>
                  <div className="flex items-center justify-end top-2 right-2 px-2 pt-2">
                    <button className={"z-20 text-black/70 hover:text-neutral transition-all duration-300"} type="button" onClick={clearInput}><ClearRoundedIcon /></button>
                  </div>
                    <textarea type="text" value={getNote} onChange={handleChange} className={wordCount == 0 ? "w-full outline-none p-4 text-base z-30 transition-all duration-300" : wordCount < 300 ? `w-full outline-none ${colorOptionValue !== "" ? colorOptionValue : bgColor} py-4 h-32 px-10 text-lg z-30 transition-all duration-300` : wordCount >= 300 ? `w-full outline-none ${colorOptionValue !== "" ? colorOptionValue : bgColor} py-4 px-6 text-base h-[35rem] z-30 transition-all duration-300` : `w-full outline-none ${colorOptionValue !== "" ? colorOptionValue : bgColor} py-4 px-4 z-30 transition-all duration-300`} placeholder="Write Note"/>

                    <div className="w-full flex justify-center items-center py-2">
                        <ColorPallete show={showColorPallete} addBackground={handleColorOption}/>
                       {updating ? <span className="loading loading-spinner loading-sm"></span> : 
                       <div className="w-full flex justify-between items-center px-3 md:px-10">
                        <div className="flex gap-2">


                          <Tooltip title="Edit" arrow>
                            <i className="w-8 h-8 flex justify-center items-center rounded-full border-[1px] border-neutral hover:bg-warning/50 hover:border-none z-30 transition-all duration-200 cursor-pointer">
                              <ColorLensRoundedIcon onClick={() => setShowColorPallete(!showColorPallete)} sx={{ fontSize: 18 }}/>
                            </i>
                          </Tooltip>


                          <Tooltip title="Delete" arrow>
                            <i className="w-8 h-8 flex justify-center items-center rounded-full border-[1px] border-neutral hover:bg-neutral/10 hover:border-none z-30 transition-all duration-200 cursor-pointer">
                              <DeleteRoundedIcon onClick={() => setShowDeleteModal(!showDeleteModal)} sx={{ fontSize: 18 }}/>
                            </i>
                          </Tooltip>
                        </div>


                        <Tooltip title="Update" arrow>
                          <button type="submit" className={wordCount > 0 ? "cursor-pointer w-8 h-8 flex justify-center items-center rounded-full border-[1px] border-neutral hover:bg-primary/10 z-30 transition-all duration-200" : "cursor-pointer bg-neutral/70 text-white rounded-full w-0 h-0 opacity-0 flex justify-center items-center transition-all duration-200"}> <CheckIcon/></button>
                        </Tooltip>
                       </div>
                       }
                    </div>
                </form>
              </div>
        </div>

        {showDeleteModal && <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/70 z-50">
            <div className="w-96 flex flex-col gap-3 px-4 py-4 bg-white rounded-md">
                <h1 className="text-lg font-semibold">Delete</h1>
                <hr />
                <p className="text-sm">Are you sure you want to Delete?</p>
                <div className="w-full flex justify-center items-center gap-5 mt-5 text-sm">
                  {isPending || isSuccess ? <span className="loading loading-spinner loading-sm"></span> : <><button className="flex justify-center items-center p-3 hover:bg-[#ff2222] bg-error rounded-md" onClick={() => mutate(noteId) && setShowDeleteModal(!showDeleteModal)}><DeleteRoundedIcon />Accept</button>
                  <button className="flex justify-center items-center p-3 bg-neutral hover:bg-black text-white rounded-md" onClick={() => setShowDeleteModal(!showDeleteModal)}><ClearRoundedIcon/>Cancel</button></>}
                </div> 
            </div>
        </div>}
    </div>
  )
}

export default Todo


// (setTodoHeight(noteRef.current.offsetHeight)
'use client'
import { useEffect, useState } from 'react'
import { getFirestore } from 'firebase/firestore'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore, analytics } from './firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}




export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredInventory, setFilteredInventory] = useState([])
  const [userInput, setUserInput] = useState('')
  const [openAIResponse, setOpenAIResponse] = useState('')

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data()
        })
      })
      setInventory(inventoryList);
      setFilteredInventory(inventoryList); // Initialize filteredInventory with the complete list
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  }


  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory();
  }

  // useEffect(() => {
  //   updateInventory()

  //   const fetchOpenAIResponse = async () => {
  //     try {
  //       const res = await fetch('/api/openai', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           messages: [
  //             { role: 'user', content: 'Hello' }
  //           ],
  //         }),
  //       });

  //       const data = await res.json();
  //       console.log(data.result);
  //     } catch (error) {
  //       console.error('Error fetching completion from OpenAI:', error);
  //     }
  //   };

  //   fetchOpenAIResponse();
  // }, [])

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpenAIRequest = async () => {
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: userInput }
          ],
        }),
      });

      const data = await res.json();
      setOpenAIResponse(data.result);
    } catch (error) {
      console.error('Error fetching completion from OpenAI:', error);
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSearch = () => {
    const filtered = inventory.filter(item =>
      item.name.toLowerCase() === searchTerm.toLowerCase()
    );
    setFilteredInventory(filtered);
  }

  const handleClear = () => { // added this
    setSearchTerm('');
    setFilteredInventory(inventory);
  }

  return(
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >

    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              sx={{width: 300 }}
              label="Search Items"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              variant="contained"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button 
              variant="outlined"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Stack>
        </Box>  

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => { setItemName(e.target.value) }}
            />
            <Button variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>

      <Box border="1px solid #333">
        <Box width="800px" height="100px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="#ADD8E6"> 
          <Typography variant="h2" color="#333" textAlign="center">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name)
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name)
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}




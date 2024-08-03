import { getEruptions } from '../utils'

export async function GET () {
  try {
    const data = await getEruptions()
  
    return new Response(
      JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'An error has occurred'
    }), {
      status: 404
    })
  }
}
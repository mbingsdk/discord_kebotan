import { useEffect, useState } from 'react'

export function useApi(requestFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    requestFn()
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, deps)

  return { data, error, loading }
}

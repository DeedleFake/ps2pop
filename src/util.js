export const ajax = async (url) => {
	return await new Promise((resolve, reject) => {
		const req = new XMLHttpRequest()
		req.onreadystatechange = () => {
			if (req.readyState === 4) {
				resolve(req.responseText)
			}
		}

		req.open('get', url)
		req.send()
	})
}

export const parseJSON = (raw) => JSON.parse(raw, (k, v) => {
	let date = Date.parse(v)
	if (!isNaN(date)) {
		return new Date(date)
	}

	return v
})

export const formatDate = (t) => `${t.getFullYear().toString().padStart(4, '0')}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')}`

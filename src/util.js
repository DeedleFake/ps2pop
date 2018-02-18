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

export const parseJSON = (raw) => JSON.parse(raw, (val) => {
	if (val.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]+Z/)) {
		return new Date(val)
	}

	return val
})

const axios = require("axios");
const { generateProductID } = require("../utils/productID");

// ideally you would use a function to refresh the token
const token =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTUzOTgxLCJpYXQiOjE3MTIxNTM2ODEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImNjMTA4N2Q3LWQ1MTgtNDRhNC1hNjMyLTU5ZGFiMDc4Y2JhZiIsInN1YiI6ImFtNTg0NUBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiU1JNIElTVCIsImNsaWVudElEIjoiY2MxMDg3ZDctZDUxOC00NGE0LWE2MzItNTlkYWIwNzhjYmFmIiwiY2xpZW50U2VjcmV0IjoieUZBWVhqZEhNUUh3V2ZZUiIsIm93bmVyTmFtZSI6IkFkaXR5YSBHdXB0YSIsIm93bmVyRW1haWwiOiJhbTU4NDVAc3JtaXN0LmVkdS5pbiIsInJvbGxObyI6IlJBMjExMTAyNjAzMDA4OSJ9.i4mWHDA-lF5X4zN9s9LWuUkosD_F36IzX6MQ_6eLSls";

const headers = {
	Authorization: `Bearer ${token}`,
};

const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];

const getProducts = (req, res) => {
	try{
        const categoryName = req.params.categoryname;
	const limit = parseInt(req.query.limit);
	const page = parseInt(req.query.page);
	const sortBy = "rating";
	const desc = false;
	const minPrice = req.query.minprice;
	const maxPrice = req.query.maxprice;

	const ProductsData = [];

	if (req.query.desc !== undefined) {
		desc = true;
	}

	if (req.query.companyname !== undefined) {
		const companyName = req.query.companyname;
		axios
			.get(
				`http://20.244.56.144/test/companies/${companyName}/categories/${categoryName}/products?top=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
				{ headers }
			)
			.then((response) => {
				response.json();
			})
			.then((data) => {
				ProductsData.push.apply(data);
			});
	} else {
		companies.map((companyName) => {
			axios
				.get(
					`http://20.244.56.144/test/companies/${companyName}/categories/${categoryName}/products?top=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
					{ headers }
				)
				.then((response) => {
					response.json();
				})
				.then((data) => {
					ProductsData.push.apply(data);
				});
		});
	}

	if (req.query.sortBy !== undefined) {
		sortBy = req.query.sortby;
	}

	if (sortOn === "rating") {
		if (desc) {
			ProductsData.sort((a, b) => b.rating - a.rating);
		}
		ProductsData.sort((a, b) => a.rating - b.rating);
	} else if (sortOn === "price") {
		if (desc) {
			ProductsData.sort((a, b) => b.price - a.price);
		}
		ProductsData.sort((a, b) => a.price - b.price);
	} else if (sortOn === "discount") {
		if (desc) {
			ProductsData.sort((a, b) => b.discount - a.discount);
		}
		ProductsData.sort((a, b) => a.discount - b.discount);
	}

	ProductsData = ProductsData.map((product) => ({
		...product,
		productID: generateProductID(product.productName),
	}));

	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	const results = {};

	results.previous = {
		page: page - 1,
		limit: limit,
	};

	results.next = {
		page: page + 1,
		limit: limit,
	};

	results.data = ProductsData.slice(startIndex,endIndex);

    res.status(200).json(results);
    }catch(e){
        res.status(500).json({
            error: e
        })
    }
};

module.exports = getProducts;
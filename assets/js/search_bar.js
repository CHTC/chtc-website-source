---
    layout: blank
---

let MainSearchBar;

function makeDelay(ms) {
    let timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
};

function create_html(data){
    let href = ""
    if(data.href){
        href = "href='" + data.href + "'"
    }

    let html = "" +
        "<div class='result card'>" +
        "<a " + href + ">" +
        "<div class='card-body p-0 p-sm-3'>" +
        "<div class='card-title text-start mb-2'>" +
        data.title +
        "</div>" +
        "<div>" +
        "<h6 class='card-subtitle text-primary text-start'>" + data.subtitle + "</h6>" +
        "</div>" +
        "</div>" +
        "</a>" +
        "</div>"

    return html
}

function SearchBar(id, index_path, metadata_path) {
    this.id = id
    this.index_path = index_path
    this.metadata_path = metadata_path
    this.node = document.getElementById(this.id)
    this.input_node = this.node.querySelector("input")
    this.result_node = this.node.querySelector(".search-results")
    this.idx = undefined
    this.metadata = undefined
    this.results = []
    this.lose_focus = undefined
    this.load_search_bar = async function(){
        await this.load_data()

        this.input_node.setAttribute("placeholder", "Search CHTC")

        this.input_node.addEventListener("input", () => {
            makeDelay(1000)(() => this.search.call(this))
        })

        document.body.addEventListener("click", (event) => {
            if (! this.node.contains(event.target)) {
                this.result_node.hidden = true
            }
        })

        this.input_node.addEventListener("focus", () => {
            this.populate_results(5)
            this.result_node.hidden = false;
        })
    }
    this.load_data = async function(cache=true) {

        if(cache){  // Check for cached data. If there use it, else load and populate it
            this.metadata = JSON.parse(sessionStorage.getItem("main_metadata"))
            if(!this.metadata){
                this.metadata = await fetch(this.metadata_path).then(data => data.json())
                sessionStorage.setItem("main_metadata", JSON.stringify(this.metadata))
            }

            let index = JSON.parse(sessionStorage.getItem("main_index"))
            if(!index){
                index = await fetch(this.index_path).then(data => data.json())
                this.idx = lunr.Index.load(index)
                sessionStorage.setItem("main_index", JSON.stringify(index))
            } else {
                this.idx = lunr.Index.load(index)
            }
        } else {
            this.metadata = await fetch(this.metadata_path).then(data => data.json())

            let index = await fetch(this.index_path).then(data => data.json())
            this.idx = lunr.Index.load(index)
        }
    }
    this.get_metadata = function(key) {
        return this.metadata[key]
    }
    this.search = function() {
        let query = this.input_node.value

        if(query == ""){
            return
        }

        this.results = this.idx.search(query)
        this.populate_results(5)
    }
    this.populate_results = async function(length) {

        this.result_node.innerHTML = ""

        if(length == undefined){
            length = (this.results.length > 15) ? 15 : this.results.length
        }

        let results_to_populate = this.results.slice(0, length)

        if( !results_to_populate.length && this.input_node.value != "" ){
            this.create_result_node().innerHTML = create_html({'title': 'No Results', "subtitle": ""})
            return
        }

        for (const result of results_to_populate) {
             await this.create_result(result.ref)
        }

        if( this.results.length > 5 && results_to_populate.length <= 5 ){
            this.create_result_node().innerHTML = create_html({'href': "javascript:MainSearchBar.populate_results()", 'title': 'Show All Results', 'subtitle': ""})
        }
    }
    this.create_result_node = function(){
        let new_result_node = document.createElement("div")
        this.result_node.appendChild(new_result_node)
        return new_result_node
    }
    this.create_result =  async function(ref){

        let new_result_node = this.create_result_node()
        let metadata = await this.get_metadata(ref)
        let complete_metadata = {id:ref, ...metadata}
        new_result_node.innerHTML = this.create_result_html(complete_metadata)
    }
    this.create_result_html = function(metadata){
        let data = {
            "href": "{{ '' | relative_url }}" + metadata.id,
            "title": metadata.title,
            "subtitle": metadata.id.slice(0,-5)
        }

        return create_html(data)
    }

    this.load_search_bar()
    this.search()
}

window.onload = () => {
    MainSearchBar = new SearchBar("main-search-bar",
        "{{ 'assets/search/index.json' | relative_url }}",
        "{{ 'assets/search/metadata.json' | relative_url }}")
}
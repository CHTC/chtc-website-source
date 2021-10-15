---
    layout: blank
---
// This page hosts the code that is used on every single page.

// If your js function does not need to be on every page don't put it here!



function makeDelay(ms) {
    var timer = 0;
    return function(callback){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
};

function SearchBar(id, index_path, metadata_path) {
    this.id = id
    this.index_path = index_path
    this.metadata_path = metadata_path
    this.node = document.getElementById(this.id)
    this.input_node = this.node.querySelector("input")
    this.result_node = this.node.querySelector(".search-results")
    this.idx = undefined
    this.metadata = undefined

    this.load_search_bar = async function(){
        await this.load_data()

        this.input_node.setAttribute("placeholder", "Search CHTC")

        this.input_node.addEventListener("keyup", () => {
            makeDelay(1000)(() => this.populate_search.call(this))
        })
        this.input_node.addEventListener("focusout", () => {
            setTimeout(() => {this.result_node.hidden = true}, 150)
        })
        this.input_node.addEventListener("focus", () => {
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
    this.populate_search = async function() {

        // Remove the current results
        this.result_node.innerHTML = ""

        let query = this.input_node.value

        if(query == ""){
            return
        }

        let results = this.idx.search(query).slice(0, 5)

        for (const result of results) {

            let new_result_node = document.createElement("div")
            this.result_node.appendChild(new_result_node)

            let metadata = await this.get_metadata(result.ref)
            let complete_metadata = {id:result.ref, ...metadata}
            new_result_node.innerHTML = this.create_results_html(complete_metadata)
        }
    }
    this.create_results_html = function(metadata){
        let html =  "<div id='search-card' class='result card'>" +
            "<div class='card-body'>" +
            "<div class='card-title text-left'>" +
            "<a href='" + metadata.id + "'>" + metadata.title + "</a>" +
            "</div>" +
            "<h6 class='card-subtitle'>" + metadata.id.slice(0,-5) + "</h6>"
            "</div>" +
            "</div>"

        return html
    }

    this.load_search_bar()
}

window.onload = () => {
    const MainSearchBar = new SearchBar("main-search-bar",
        "{{ 'assets/search/index.json' | relative_url }}",
        "{{ 'assets/search/metadata.json' | relative_url }}")
}
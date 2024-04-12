# Guide

## Creating dropdowns

```html
<!--Replace ALL occurrences of accordionExample in this dropdown with a unique string id dropdown-->
<!--For instance if this is for a python item you could replace it with `python`-->

<div class="accordion pb-3" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header mt-0" id="accordionExample-heading">
      <button class="accordion-button p-2" type="button" data-bs-toggle="collapse" data-bs-target="#accordionExample-collapseOne" aria-expanded="true" aria-controls="accordionExample-collapseOne">
        !!!This is the header of the dropdown!!!
      </button>
    </h2>
    <div id="accordionExample-collapseOne" class="accordion-collapse collapse" aria-labelledby="accordionExample-headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body p-2">
        !!!This is the content of the dropdown!!!
      </div>
    </div>
  </div>
</div>
```

### Example

```html
<div class="accordion" id="python">
  <div class="accordion-item">
    <h2 class="accordion-header mt-0" id="python-heading">
      <button class="accordion-button p-2" type="button" data-bs-toggle="collapse" data-bs-target="#python-collapseOne" aria-expanded="true" aria-controls="python-collapseOne">
        !!!This is the header of the dropdown!!!
      </button>
    </h2>
    <div id="python-collapseOne" class="accordion-collapse collapse show" aria-labelledby="python-headingOne" data-bs-parent="#python">
      <div class="accordion-body p-2">
        !!!This is the content of the dropdown!!!
      </div>
    </div>
  </div>
</div>
```
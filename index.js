let root = document.getElementById("root");
let slideContainer = document.getElementById("slides");
let slides = document.getElementsByClassName("slide");
let textboxCreator = document.getElementById("textbox");
let content = document.getElementById("content");
let textboxes = document.getElementsByClassName("textbox")



let currentSlideNum = 0;
let currentSlide = slides[currentSlideNum];

let selected = null;



let canSpawn = false

textboxCreator.addEventListener("click", () => {
    canSpawn = !canSpawn
})

document.addEventListener('click', function(event) {


    if(event.target.getAttribute("id") == "slide") {
        if (currentSlide) {
            currentSlide.classList.remove("selected");
        }
        currentSlideNum = event.target.getAttribute("num");
        currentSlide = slides[currentSlideNum];
        currentSlide.classList.add("selected");
    }
    textboxes = document.getElementsByClassName("textbox")
    updateTextboxes()

    for (let i = 0; i < slides.length; i++) {
        slides[i].addEventListener('click', () => {
            if (currentSlide) {
                currentSlide.classList.remove("selected");
            }
            currentSlideNum = i;
            currentSlide = slides[currentSlideNum];
            currentSlide.classList.add("selected");
        });
    }

    if(event.target == content) {
        if(currentSlide && canSpawn) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
    
            // Create textbox element
            const textbox = document.createElement('textarea');
            textbox.classList.add("textbox")
            textbox.style.display = "none"

            textbox.setAttribute("left", mouseX + "px")
            textbox.setAttribute("top", mouseY + "px")

            textbox.setAttribute("w", textbox.clientWidth)
            textbox.setAttribute("h", textbox.clientHeight)


            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                  const { target, contentRect } = entry;
                  
                  // Check if the size has changed
                  if (contentRect.width !== target.offsetWidth || contentRect.height !== target.offsetHeight && textbox == selected) {
                    textbox.setAttribute("w", contentRect.width)
                    textbox.setAttribute("h", contentRect.height)


                    updateSelected(textbox)
    
                    // You can perform any additional actions here
                  }
                }
              });

            resizeObserver.observe(textbox);

            textbox.addEventListener("input", (e) => {
                console.log(textbox)
                textbox.setAttribute("text", e.target.value)
            })

            textbox.addEventListener("focus", () => {
                selected = textbox
                updateSelected(textbox);
            })

            textbox.setAttribute("slide", currentSlideNum)

            textbox.textContent = textbox.getAttribute("text")
            
            // Set textbox position

            content.appendChild(textbox)
    
            // Focus on the textbox
            textbox.focus();

            updateTextboxes()
        }
    }
    // Get mouse coordinates
  });


document.addEventListener('dblclick', (e) => {
    if(event.target == content && event.target.id != "textbox") {
        selected = null
        updateSelected(selected)
    }
})


window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key == 'm') {
        e.stopImmediatePropagation()
        const newDiv = document.createElement("div");
        newDiv.setAttribute("num", slides.length.toString());
        newDiv.classList.add("slide");
        newDiv.setAttribute("id", "slide")
        newDiv.addEventListener('click', () => {
            if (currentSlide) {
                currentSlide.classList.remove("selected");
            }
            currentSlideNum = slides.length;
            currentSlide = newDiv;
            currentSlide.classList.add("selected");
        });
        slideContainer.appendChild(newDiv);
        slides = document.getElementsByClassName("slide");
    } else if (e.key == 'ArrowUp') {
        if(currentSlide) {
            if(slides[currentSlideNum - 1] != null) {
                currentSlideNum--;
            }
            if (currentSlide) {
                currentSlide.classList.remove("selected");
            }
            currentSlide = slides[currentSlideNum];
            currentSlide.classList.add("selected");
            updateTextboxes()
        }
    } else if (e.key == 'ArrowDown') {
        if(currentSlide) {
            if(slides[currentSlideNum + 1] != null) {
                currentSlideNum++;
            }

            if (currentSlide) {
                currentSlide.classList.remove("selected");
            }
            currentSlide = slides[currentSlideNum];
            currentSlide.classList.add("selected");
            updateTextboxes()
        }
    } // Other keydown actions...
    
        
    
});

function updateTextboxes() {
    textboxes = document.getElementsByClassName("textbox")
    if(currentSlide) {
        for(let i = 0; i < textboxes.length; i++) {
            if(currentSlide.getAttribute("num") == textboxes[i].getAttribute("slide")) {
                const textbox = textboxes[i]
                textbox.textContent = textbox.getAttribute("text")
                textbox.style.left = textbox.getAttribute("left")
                textbox.style.top = textbox.getAttribute("top")
                textbox.style.display = "block"
            } else {
                textboxes[i].style.display = "none"
            }
        }
    }
}

function save() {
    localStorage.clear()
    localStorage.setItem("slides", slides.length)
    for(let i = 0; i < textboxes.length; i++) {
        localStorage.setItem(`t${i}left`, textboxes[i].getAttribute("left"))
        localStorage.setItem(`t${i}top`, textboxes[i].getAttribute("top"))
        localStorage.setItem(`t${i}text`, textboxes[i].getAttribute("text"))
        localStorage.setItem(`t${i}slide`, textboxes[i].getAttribute("slide"))
        if(textboxes[i].getAttribute("w") && textboxes[i].getAttribute("h")) {
            localStorage.setItem(`t${i}w`, textboxes[i].getAttribute("w"))
            localStorage.setItem(`t${i}h`, textboxes[i].getAttribute("h"))
        }
    }
    localStorage.setItem("textBoxSize", textboxes.length)
    alert("Saved Succssfully?")
}

function load() {
    for(let i = 0; i < slides.length; i++) {
        slides[i].remove();
    }
    for(let i = 0; i < textboxes.length; i++) {
        textboxes[i].remove();
    }
    slides = []
    textboxes = []
    if(typeof localStorage.getItem("slides") != "undefined") {
        for(let i = 0; i < localStorage.getItem("slides"); i++) {
            const newDiv = document.createElement("div");
            newDiv.setAttribute("num", slides.length.toString());
            newDiv.classList.add("slide");
            newDiv.setAttribute("id", "slide")
            newDiv.addEventListener('click', () => {
                if (currentSlide) {
                    currentSlide.classList.remove("selected");
                }
                currentSlideNum = slides.length - 1;
                currentSlide = newDiv;
                currentSlide.classList.add("selected");
            });
            slideContainer.appendChild(newDiv);
            slides = document.getElementsByClassName("slide");
        }
        updateTextboxes()
    }

    if(typeof localStorage.getItem("textBoxSize") != "undefined") {
        for(let i = 0; i < localStorage.getItem("textBoxSize"); i++) {
            if(typeof localStorage.getItem(`t${i}left`) != "undefined" && typeof localStorage.getItem(`t${i}top`) != "undefined" && typeof localStorage.getItem(`t${i}text`) != "undefined" && typeof localStorage.getItem(`t${i}slide`) != "undefined" && typeof localStorage.getItem(`t${i}w`) != "undefined" && typeof localStorage.getItem(`t${i}h`) != "undefined") {
                const textbox = document.createElement('textarea');
                textbox.classList.add("textbox")
                textbox.style.display = "none"

                textbox.setAttribute("left", localStorage.getItem(`t${i}left`))
                textbox.setAttribute("top", localStorage.getItem(`t${i}top`))
                textbox.setAttribute("slide", localStorage.getItem(`t${i}slide`))

    
                
                // Set textbox position
                textbox.addEventListener("input", (e) => {
                    textbox.setAttribute("text", e.target.value)
                    textbox.textContent = e.target.value
                })



                textbox.addEventListener("focus", () => {
                    selected = textbox
                    updateSelected(textbox)
                })

                textbox.addEventListener("focusout", () => {
                    selected = null
                    updateSelected(selected)
                })


                if(localStorage.getItem(`t${i}text`) == null) {
                    console.log('here')
                    textbox.textContent = ""
                } else {
                    console.log("iluvbbc")
                    console.log(localStorage.getItem(`t${i}text`))
                    textbox.textContent = localStorage.getItem(`t${i}text`)
                    textbox.setAttribute("text", localStorage.getItem(`t${i}text`))
                }

                const resizeObserver = new ResizeObserver(entries => {
                    for (const entry of entries) {
                      const { target, contentRect } = entry;
                      
                      // Check if the size has changed
                      if (contentRect.width !== target.offsetWidth || contentRect.height !== target.offsetHeight && textbox == selected) {
                        updateSelected(textbox)
                        
                        // You can perform any additional actions here
                      }
                    }
                  });
            
                resizeObserver.observe(textbox);

                textbox.style.width = localStorage.getItem(`t${i}w`) + "px"
                textbox.style.height = localStorage.getItem(`t${i}h`) + "px"

        

                content.appendChild(textbox)
                updateTextboxes();
                
            }
        }
    }
    localStorage.clear()
    alert("Don't forget to save (WILL LOSE ALL PROGRESS IF YOU DON'T SAVE)")
}

function updateSelected(obj) {
    let formatter = document.getElementById("formatter")
    if(selected != null && obj != null) {
        formatter.innerHTML = ""
        formatter.innerHTML += `<div><input id="w" value=${selected.clientWidth}><br/><input id="h" value=${selected.clientHeight}></div></br>`
        //formatter.innerHTML += `<button onclick=${updateSelectedSize(document.getElementById("w").value, document.getElementById("h").value)}>change size</button>`


        const item = document.createElement('button');

        item.textContent = "Load"
        item.addEventListener('click', () => {
            updateSelectedSize(document.getElementById("w").value, document.getElementById("h").value, obj)
        })

        formatter.appendChild(item)
    } else {
        formatter.innerHTML = "No item currently being formatted"
    }
}

function updateSelectedSize(w, h, item) {
    if(selected != null && item != null) {
        selected.style.width = w + "px"
        item.setAttribute("w", w)
        item.setAttribute("h", h)
        selected.style.height = h + "px"
    }
}

let saver = document.getElementById("save")
let loader = document.getElementById("load")

saver.addEventListener('click', () => {
    save()
})
loader.addEventListener('click', () => {
    load()
})

function toggleBoldFormatting() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Create a <b> element and wrap the selected range with it
    const boldElement = document.createElement('b');
    boldElement.appendChild(range.extractContents());
    range.insertNode(boldElement);

    // Clear the selection
    selection.removeAllRanges();
}

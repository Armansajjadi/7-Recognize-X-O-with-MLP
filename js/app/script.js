let weights = []

let alfa = 0.01;

let v = []

let dataForTrain = []

let btns = null

let b = []

let biasHidden = []

window.addEventListener("load", () => {

    focused();

    fetch('trainData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('File not found');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data exists, returning 1");
            console.log("Weights:", data.weights);
            console.log("V:", data.v);
            console.log("b:", data.b);

            weights = data.weights;
            v = data.v;
            b = data.b;
            biasHidden = data.biasHidden
            test()

            btnsAboutTrainSection.classList.add("hidden");
            btnSecSabt.classList.remove("hidden");
        })
        .catch(error => {
            console.log("No data found or error occurred, returning 0");
            console.error(error);

        });
});

function test() {
    let counter = 0;

    fetch("testjabbar.json")
        .then(res => res.json())
        .then(array => {
            array.forEach(item => {
                item.data = item.data.flat();
            });

            let x = Array(25).fill(0),
                z = Array(19).fill(0),
                y = Array(2).fill(0);
            y = Array(2).fill(0);
            let zNetinput = 0

            array.forEach(item => {
                item.data.forEach((num, index) => {
                    x[index] = num
                })

                zNetinput = 0

                for (let j = 0; j < 19; j++) {
                    zNetinput = b[j];
                    for (let i = 0; i < 25; i++) {
                        zNetinput += (x[i] * weights[i][j]);
                    }
                    z[j] = (bipolarSigmoid(zNetinput));
                }
    
                let yNetinput = 0
    
                for (let k = 0; k < 2; k++) {
                    yNetinput = biasHidden[k]
                    for (let j = 0; j < 19; j++) {
                        yNetinput += (z[j] * v[j][k])
                    }
                    y[k] = bipolarSigmoid(yNetinput);
                    if (y[k] > 0){
                        y[k]=1
                    }else{
                        y[k]=-1
                    }
                }

                if(isArraysEqual(item.y,y)){
                    counter++
                }

            })

            const accuracyValue = document.getElementById("accuracyValue");
            accuracyValue.innerHTML = `${((counter / array.length) * 100).toFixed(2)}%`;
        });
}

function isArraysEqual(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function showModal(message) {
    const modal = document.getElementById('blue-modal');
    const modalMessage = document.getElementById('modal-message');

    modalMessage.textContent = message;

    modal.style.display = 'block';

    modal.style.animation = 'fadeIn 0.5s ease';

    setTimeout(() => {
        closeModal(modal);
    }, 1500);
}

function closeModal(modal) {
    modal.style.animation = 'fadeOut 0.5s ease';
    modal.style.display = 'none';
}



const recognizeBtn = document.getElementById("recognizeBtn")

const btnsAboutTrainSection = document.getElementById("btnsAboutTrainSection")

const doneTrainBtn = document.getElementById("doneTrainBtn")

const btnSecSabt = document.getElementById("btnSecSabt")


function focused() {
    const btnContainer = document.getElementById("btnContainer");

    // Generate buttons and set their initial IDs
    for (let i = 0; i < 25; i++) {
        btnContainer.insertAdjacentHTML(
            "beforeend",
            `<button id="onactive" class="btn bg-blue-500 dark:bg-blue-600 hover:bg-blue-700 text-white font-semibold p-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"></button>`
        );
    }

    // Select all buttons
    btns = document.querySelectorAll(".btn");

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.id === "onactive") {
                // Change classes for active state
                btn.classList.replace("bg-blue-500", "bg-rose-500");
                btn.classList.replace("dark:bg-blue-600", "dark:bg-rose-700");
                btn.classList.replace("hover:bg-blue-700", "hover:bg-rose-800");
                btn.id = "active"; // Change ID to active
            } else if (btn.id === "active") {
                // Revert classes to inactive state
                btn.classList.replace("bg-rose-500", "bg-blue-500");
                btn.classList.replace("dark:bg-rose-700", "dark:bg-blue-600");
                btn.classList.replace("hover:bg-rose-800", "hover:bg-blue-700");
                btn.id = "onactive"; // Change ID back to onactive
            }
        });
    });
}




doneTrainBtn.addEventListener("click", () => {

    fetch("trainDataSets.json").then(res => {
        if (res.ok) {
            return res.json()
        }
    }).then(array => {
        array.forEach(item => {
            item.data = item.data.flat()
        })
        dataForTrain = JSON.parse(JSON.stringify(array));
        fetch("validationDataSets.json").then(res => {
            if (res.ok) {
                return res.json()
            }
        }).then(d => {
            d.forEach(item => {
                item.data = item.data.flat()
            })
            let dataForValidation = JSON.parse(JSON.stringify(d));
            let epoch = 0

            let training = true

            let deltaV = []

            let deltaW = [];

            for (let i = 0; i < 25; i++) {
                let temparr = []
                for (let j = 0; j < 19; j++) {
                    temparr[j] = (Math.random() - 0.5)
                }
                weights[i] = [...temparr];
                deltaW.push(temparr);
            }
            let deltaBiasHidden = [];
            deltaBiasHidden.push(0);
            deltaBiasHidden.push(0);
            let deltaBias = []
            for (let j = 0; j < 19; j++) {
                b.push(Math.random() - 0.5)
                deltaBias.push(0)
            }
            biasHidden = [Math.random() - 0.5, Math.random() - 0.5];
            for (let i = 0; i < 19; i++) {
                v[i] = [Math.random() - 0.5, Math.random() - 0.5]
                deltaV[i] = [0, 0]
            }

            let x = Array(25).fill(0),
                z = Array(19).fill(0),
                y = Array(2).fill(0),
                javab = Array(2).fill(0),
                deltaKuchak = Array(2).fill(0),
                D = Array(19).fill(0),
                zNetInputs = Array(19).fill(0);
            let zNetinput = 0
            let yNetinput = 0

            while (training) {

                dataForTrain.forEach(item => {

                    item.data.forEach((num, index) => {
                        x[index] = num
                    })
                    // console.log(x);
                    zNetinput = 0

                    for (let j = 0; j < 19; j++) {
                        zNetinput = b[j];
                        for (let i = 0; i < 25; i++) {
                            zNetinput += (x[i] * weights[i][j]);
                        }
                        z[j] = (bipolarSigmoid(zNetinput));
                        zNetInputs[j] = zNetinput;
                    }

                    yNetinput = 0

                    for (let k = 0; k < 2; k++) {
                        yNetinput = biasHidden[k]
                        for (let j = 0; j < 19; j++) {
                            yNetinput += (z[j] * v[j][k])
                        }
                        y[k] = bipolarSigmoid(yNetinput);
                        let moshtag = moshtagbipolarSigmoid(yNetinput)
                        deltaKuchak[k] = ((item.y[k] - y[k]) * moshtag);
                        for (let j = 0; j < 19; j++) {
                            deltaV[j][k] = (alfa * deltaKuchak[k] * z[j])
                        }
                        deltaBiasHidden[k] = alfa * deltaKuchak[k]
                    }

                    let deltaKuchakJ = Array(19).fill(0);
                    for (let j = 0; j < 19; j++) {
                        deltaKuchakJ[j] = 0;
                        for (let k = 0; k < 2; k++) {
                            D[j] = deltaKuchak[k] * v[j][k]; // Contribution from output neuron k
                            let temp = moshtagbipolarSigmoid(zNetInputs[j]); // Derivative of activation function
                            deltaKuchakJ[j] += D[j] * temp; // Accumulate contribution
                        }
                    }


                    for (let i = 0; i < 25; i++) {
                        for (let j = 0; j < 19; j++) {
                            deltaW[i][j] = alfa * deltaKuchakJ[j] * x[i];
                            deltaBias[i] = alfa * deltaKuchakJ[j];
                        }
                    }


                    for (let i = 0; i < 25; i++) {
                        for (let j = 0; j < 19; j++) {
                            weights[i][j] += deltaW[i][j];
                        }
                    }


                    for (let j = 0; j < 19; j++) {
                        for (let k = 0; k < 2; k++) {
                            v[j][k] += deltaV[j][k];
                        }
                    }

                })

                epoch++
                console.log(epoch);

                let batchSize = 5;
                let currentBatch = 0;

                let startIndex = currentBatch * batchSize;
                let endIndex = Math.min(startIndex + batchSize, dataForValidation.length);

                let allCorrect = true;

                for (let i = startIndex; i < endIndex; i++) {
                    let item = dataForValidation[i];
                    item.data.forEach((num, index) => {
                        x[index] = num;
                    });

                    for (let j = 0; j < 19; j++) {
                        zNetinput = b[j];
                        for (let i = 0; i < 25; i++) {
                            zNetinput += x[i] * weights[i][j];
                        }
                        z[j] = bipolarSigmoid(zNetinput);
                    }

                    for (let k = 0; k < 2; k++) {
                        yNetinput = biasHidden[k];
                        for (let j = 0; j < 19; j++) {
                            yNetinput += z[j] * v[j][k];
                        }
                        y[k] = bipolarSigmoid(yNetinput);

                        javab[k] = y[k] > 0 ? 1 : -1;
                    }

                    if (!isArraysEqual(item.y, javab)) {
                        allCorrect = false;
                        break;
                    }
                }

                if (allCorrect) {
                    training = false;
                } else {
                    currentBatch++;
                    if (currentBatch * batchSize >= dataForValidation.length) {
                        currentBatch = 0;
                    }
                }
                if (epoch ==5000) {
                    break
                }
            }

            console.log("finished at", epoch, "epoches");

            const data = {
                weights,
                b,
                biasHidden,
                v
            };

            const jsonData = JSON.stringify(data);

            const blob = new Blob([jsonData], { type: 'application/json' });

            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'trainData.json';
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);

            URL.revokeObjectURL(url);

            console.log("Data has been saved as JSON file!");

            btnsAboutTrainSection.classList.add("hidden");
            btnSecSabt.classList.remove("hidden");
        }).catch(err => console.error(err))


    }).catch(err => {
        console.error(err)
    })

});

function bipolarSigmoid(x) {
    return (2 / (1 + Math.exp(-x))) - 1;
}
function moshtagbipolarSigmoid(x) {
    const sigmoidValue = bipolarSigmoid(x);
    return ((1 + sigmoidValue) * (1 - sigmoidValue)) / 2;
}



recognizeBtn.addEventListener("click", () => {
    let infoes = [];
    let x = Array(25).fill(0),
        z = Array(19).fill(0),
        y = Array(2).fill(0),
        netInput = Array(2).fill(0);
    y = Array(2).fill(0);
    let zNetinput = 0
    const flag = Array.from(btns).some(btn => btn.id === "active");

    if (flag) {
        btns.forEach(btn => {
            if (btn.id === "active") {
                infoes.push(1);
            } else {
                infoes.push(-1);
            }
        });

        infoes.forEach((num, index) => {
            x[index] = num
        })

        zNetinput = 0

        for (let j = 0; j < 19; j++) {
            zNetinput = b[j];
            for (let i = 0; i < 25; i++) {
                zNetinput += (x[i] * weights[i][j]);
            }
            z[j] = (bipolarSigmoid(zNetinput));
        }

        let yNetinput = 0

        for (let k = 0; k < 2; k++) {
            yNetinput = biasHidden[k]
            for (let j = 0; j < 19; j++) {
                yNetinput += (z[j] * v[j][k])
            }
            y[k] = bipolarSigmoid(yNetinput);
        }

        netInput = [...y];

        if (netInput[0] > 0 && netInput[1] < 0) {
            showModal("it is a X");
        } else if (netInput[0] < 0 && netInput[1] > 0) {
            showModal("it is a O");
        } else {
            showModal("can't recognize :(");
        }


        setTimeout(() => {
            btns.forEach(btn => {
                if (btn.id == "active") {
                    // Revert classes to inactive state
                    btn.classList.replace("bg-rose-500", "bg-blue-500");
                    btn.classList.replace("dark:bg-rose-700", "dark:bg-blue-600");
                    btn.classList.replace("hover:bg-rose-800", "hover:bg-blue-700");
                    btn.id = "onactive"; // Change ID back to onactive
                }
            });
        }, 1500);
    } else {
        showModal("you should make a X or O first");
    }
});

import { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TemplateCardContent from './TemplateCardContent'; // Import the new component

const VariableModal = ({ show, handleClose, templateData,setTemplateData ,variableValues ,setVariableValues ,SendVariableTemplate }) => {
  // const [variableValues, setVariableValues] = useState({});
  const [templateData_bkp, setTemplateData_bkp] = useState({});
  
  console.log("<><>><>templateData<><<<",templateData.id)
   useEffect(() => {
     setTemplateData_bkp(templateData);
   }, []);


   // Function to handle changes in input fields and update templateData
   const handleVariableChange = (variable, value, type) => {

    const newVariableValues = {
      ...variableValues,
      [type]: {
        ...variableValues[type],
        [variable]: value
      }
    };

    // const newVariableValues = {
    //   ...variableValues,
    //   [type]:value  // Extracts only the values in an array
    // };

    setVariableValues(newVariableValues);

    // Retrieve the original text for the specific type (header or body)
    let updatedText = templateData_bkp[type];

    // Replace each placeholder like {{1}}, {{2}}, etc. with updated values
    Object.keys(newVariableValues[type]).forEach((varKey) => {
      const regex = new RegExp(`\\{\\{\\s*${varKey}\\s*\\}\\}`, 'g');
      updatedText = updatedText.replace(regex, newVariableValues[type][varKey] || `{{${varKey}}}`);
    });

    // Update the relevant text field in templateData based on type
    setTemplateData((prev) => ({
      ...prev,
      [type]: updatedText,
    }));
  };



 // Extract variables like {{1}}, {{2}}, etc. from the template text
//  const variableMatches = templateData_bkp?.body_text?.match(/{{\d+}}/g) || [];
//  const uniqueVariables = [...new Set(variableMatches?.map((v) => v.replace(/[{}]/g, '')))];

//  const headerVariableMatches = templateData_bkp?.header_text?.match(/{{\d+}}/g) || [];
//  const headerUniqueVariables = [...new Set(headerVariableMatches?.map((v) => v.replace(/[{}]/g, '')))];


 // Extract variables like {{Service Name}}, {{Date & Time}}, {{Username}}, etc.
const variableMatches = templateData_bkp?.body_text?.match(/{{[^}]+}}/g) || [];
const uniqueVariables = [...new Set(variableMatches?.map((v) => v.replace(/[{}]/g, '')))];

// Similarly for header variables
const headerVariableMatches = templateData_bkp?.header_text?.match(/{{[^}]+}}/g) || [];
const headerUniqueVariables = [...new Set(headerVariableMatches?.map((v) => v.replace(/[{}]/g, '')))];


const areAllVariablesFilled = () => {
  return uniqueVariables.every((variable) => variableValues?.body_text?.[variable]) &&
         headerUniqueVariables.every((variable) => variableValues?.header_text?.[variable]);
};

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className={`modal-dialog modal-lg ${show ? 'zoom-out-animation' : ''}`}>
        <div className="modal-content" style={{padding:"0%" ,margin:"auto"}}>
          <div className="modal-header" style={{margin:"0%"}} >
            <h6 className="modal-title">Add Variables to Template</h6>
            <button type="button" className="btn-close mt-5"  onClick={handleClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            {/* Template Preview */}
            <TemplateCardContent template={templateData} />
            {/* Header Variables Section */}
            {headerUniqueVariables?.length > 0 && <h6><b>Header</b></h6>}
            {headerUniqueVariables?.map((variable, index) => (
                <>
                 <div className="text-secondary mb-2">{`{{${variable}}}`}</div>
                <div key={index} className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Enter value for variable ${variable}`}
                    value={variableValues?.header_text?.[variable] || ''}
                    onChange={(e) => handleVariableChange(variable, e.target.value ,"header_text")}
                  />
                  <span className="input-group-text text-success">{`{{ }}`}</span>
                </div>
                </>
              ))}

            {/* Body Variables Section */}
           {uniqueVariables?.length > 0 && <h6><b>Body</b></h6>}
           {uniqueVariables?.map((variable, index) => (
             <>
              <div className="text-secondary mb-2">{`{{${variable}}}`}</div>
             <div key={index} className="input-group mb-3">
               <input
                 type="text"
                 className="form-control"
                 placeholder={`Enter value for variable ${variable}`}
                 value={variableValues?.body_text?.[variable] || ''}
                 onChange={(e) => handleVariableChange(variable, e.target.value ,"body_text")}
               />
               <span className="input-group-text text-success">{`{{ }}`}</span>
             </div>
             </>
           ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Send Later</button>
            <button type="button" className="btn btn-success" disabled={!areAllVariablesFilled()}   onClick={() => SendVariableTemplate(templateData?.id)}
            >Send Now</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .modal-body {
          font-size: 0.6rem;
          max-height: 72vh;
          overflow-y: auto;
          padding: 0px 20px 0px 20px;
        }
        .template-card {
          border: 1px solid #ddd;
          padding: 5px;
          margin-bottom: 8px;
          border-radius: 5px;
          width:250px;
        }
        .template-header, .template-body, .template-footer {
          font-size: 0.8rem;
          padding:8px;
          margin:0%;
        }
        .input-group .form-control, .input-group .input-group-text {
          font-size: 0.8rem;
          padding: 6px 8px;
        }
        .template-buttons a.whatsapp-button {
          font-size: 0.8rem;
          padding: 4px 6px;
          margin-right: 4px;
        }
        .text-secondary {
          font-size: 0.75rem;
        }
        .modal-body::-webkit-scrollbar {
          width: 3px;
        }
            
        .modal-body::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
        }
            
        .modal-body::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }
        .modal-header .btn-close {
        top: 0%;
        left: unset;
        right: 2%;
        box-shadow: none;
       }
        .modal.show .modal-dialog {
            transform: none;
            margin: auto;
        }
      `}</style>
    </div>
  );
};

export default VariableModal;
